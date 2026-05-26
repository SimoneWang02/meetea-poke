# syntax=docker/dockerfile:1.7

# ---------- Stage 1: composer dependencies ----------
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --prefer-dist \
    --no-interaction \
    --no-progress \
    --ignore-platform-reqs

# ---------- Stage 2: frontend assets (Vite) ----------
FROM node:24-alpine AS assets
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY resources ./resources
COPY public ./public
COPY vite.config.js ./
RUN npm run build

# ---------- Stage 3: app runtime (PHP-FPM) ----------
FROM php:8.3-fpm-alpine AS app

RUN apk add --no-cache \
        bash \
        icu-dev \
        libzip-dev \
        libpng-dev \
        libjpeg-turbo-dev \
        freetype-dev \
        oniguruma-dev \
        mysql-client \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        mbstring \
        bcmath \
        intl \
        zip \
        gd \
        opcache \
        exif \
        pcntl \
    && rm -rf /var/cache/apk/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . /var/www
COPY --from=vendor /app/vendor /var/www/vendor
COPY --from=assets /app/public/build /var/www/public/build

RUN composer dump-autoload --optimize --no-dev --classmap-authoritative \
 && chown -R www-data:www-data storage bootstrap/cache \
 && chmod -R ug+rwx storage bootstrap/cache

COPY docker/php/php.ini /usr/local/etc/php/conf.d/zz-app.ini
COPY docker/php/www.conf /usr/local/etc/php-fpm.d/zz-www.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 9000
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm"]

# ---------- Stage 4: nginx with baked-in public assets ----------
FROM nginx:1.27-alpine AS web
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=app /var/www/public /var/www/public
EXPOSE 80
