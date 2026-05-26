<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>MeeTea&Poke - Poke Bowl e Bubble Tea a Carpi</title>
    <link rel="icon" type="image/png" href="/images/logo.svg">
    <meta name="description" content="Poke bowl personalizzate, bubble tea artigianale e sfizi a Carpi. Ordina online e ritira in negozio in Piazzale Dante Alighieri 6.">
    <meta name="google-site-verification" content="oKZFEMyPD9UTemjMwkTTsIO-9Kb6d_h8EnnTvHiF4Eg" />
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800&display=swap" rel="stylesheet">
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
