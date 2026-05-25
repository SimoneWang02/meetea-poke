#!/usr/bin/env bash
set -euo pipefail

SSH_HOST="${SSH_HOST:-meetea}"
REMOTE_DIR="${REMOTE_DIR:-~/meetea}"
COMPOSE_FILE="docker-compose.prod.yaml"
BRANCH="${BRANCH:-main}"
HEALTH_URL="${HEALTH_URL:-https://meetea-poke.com/up}"

c_red()   { printf '\033[31m%s\033[0m\n' "$*"; }
c_green() { printf '\033[32m%s\033[0m\n' "$*"; }
c_blue()  { printf '\033[34m%s\033[0m\n' "$*"; }
c_yellow(){ printf '\033[33m%s\033[0m\n' "$*"; }

step() { c_blue "▶ $*"; }
ok()   { c_green "✓ $*"; }
warn() { c_yellow "⚠ $*"; }
die()  { c_red   "✗ $*"; exit 1; }

step "Checking local repo state"
[ "$(git rev-parse --abbrev-ref HEAD)" = "$BRANCH" ] || die "Not on branch '$BRANCH' (use BRANCH=... to override)"
git diff --quiet || die "Uncommitted changes present. Commit or stash first."
git diff --cached --quiet || die "Staged but uncommitted changes present. Commit first."

LOCAL_SHA=$(git rev-parse HEAD)
REMOTE_SHA=$(git rev-parse "origin/$BRANCH" 2>/dev/null || echo "")
if [ "$LOCAL_SHA" != "$REMOTE_SHA" ]; then
    step "Pushing to origin/$BRANCH"
    git push origin "$BRANCH"
fi
ok "Local repo clean, pushed: ${LOCAL_SHA:0:8}"

step "Connecting to $SSH_HOST and deploying"
ssh -o BatchMode=yes "$SSH_HOST" bash <<EOF
set -euo pipefail
cd $REMOTE_DIR

echo "▶ Pulling latest from $BRANCH"
git fetch origin
git reset --hard origin/$BRANCH

DEPLOYED_SHA=\$(git rev-parse HEAD)
echo "✓ Now at: \${DEPLOYED_SHA:0:8}"

echo "▶ Building images"
docker compose -f $COMPOSE_FILE build

echo "▶ Recreating containers"
docker compose -f $COMPOSE_FILE up -d --remove-orphans

echo "▶ Running migrations"
docker compose -f $COMPOSE_FILE exec -T app php artisan migrate --force

echo "▶ Pruning dangling images"
docker image prune -f >/dev/null

echo "▶ Final status:"
docker compose -f $COMPOSE_FILE ps
EOF

step "Health check: $HEALTH_URL"
sleep 3
for i in 1 2 3 4 5 6; do
    if curl -fsS -o /dev/null --max-time 5 "$HEALTH_URL"; then
        ok "Deploy successful - site is up"
        exit 0
    fi
    warn "Attempt $i failed, retrying in 5s..."
    sleep 5
done
die "Health check failed after retries. Check 'ssh $SSH_HOST docker compose -f $REMOTE_DIR/$COMPOSE_FILE logs'"
