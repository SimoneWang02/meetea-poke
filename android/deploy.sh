#!/usr/bin/env bash
# Builda l'APK debug e la installa via USB su un Sunmi già configurato
# (aggiorna l'app esistente senza toccare URL/token già salvati).
set -euo pipefail

cd "$(dirname "$0")"

if ! command -v adb >/dev/null 2>&1; then
    echo "Errore: adb non trovato nel PATH. Installa Android platform-tools." >&2
    exit 1
fi

DEVICES=$(adb devices | awk 'NR>1 && $2=="device" {print $1}')
if [ -z "$DEVICES" ]; then
    echo "Errore: nessun device connesso via adb (controlla cavo USB e debug USB attivo)." >&2
    exit 1
fi

echo "==> Build APK debug..."
./gradlew assembleDebug

APK="app/build/outputs/apk/debug/app-debug.apk"
if [ ! -f "$APK" ]; then
    echo "Errore: APK non trovato in $APK" >&2
    exit 1
fi

echo "==> Installazione su device: $DEVICES"
adb install -r "$APK"

echo "==> Fatto. App aggiornata sul device."
