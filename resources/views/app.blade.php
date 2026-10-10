<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>MeeTea&Poke - Ordina da Asporto | Poke & Bubble Tea Carpi</title>
    <link rel="icon" type="image/png" href="/images/logo.svg">
    <meta name="description" content="Poke bowl personalizzate, bubble tea artigianale e sfizi a Carpi. Ordina online e ritira in negozio in Piazzale Dante Alighieri 6.">
    <meta name="keywords" content="poke carpi, poke bowl carpi, bubble tea carpi, meetea poke, ordina poke carpi, pokè bar carpi">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://meetea-poke.com/">
    <meta name="google-site-verification" content="oKZFEMyPD9UTemjMwkTTsIO-9Kb6d_h8EnnTvHiF4Eg" />

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="MeeTea&Poke - Ordina da Asporto | Poke & Bubble Tea Carpi">
    <meta property="og:description" content="Poke bowl personalizzate, bubble tea artigianale e sfizi a Carpi. Ordina online e ritira in negozio in Piazzale Dante Alighieri 6.">
    <meta property="og:url" content="https://meetea-poke.com/">
    <meta property="og:image" content="https://meetea-poke.com/images/og-image.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:card" content="summary_large_image">
    <meta property="og:locale" content="it_IT">
    <meta property="og:site_name" content="MeeTea&Poke">

    <!-- Schema.org WebSite (controlla il nome sito nei risultati Google) -->
    <script type="application/ld+json">
    {
        "@@context": "https://schema.org",
        "@type": "WebSite",
        "name": "MeeTea&Poke",
        "url": "https://meetea-poke.com"
    }
    </script>

    <!-- Schema.org LocalBusiness -->
    <script type="application/ld+json">
    {
        "@@context": "https://schema.org",
        "@type": "FoodEstablishment",
        "name": "MeeTea&Poke",
        "description": "Poke bowl personalizzate, bubble tea artigianale e sfizi a Carpi.",
        "url": "https://meetea-poke.com",
        "telephone": "+393335068836",
        "servesCuisine": ["Poke", "Bubble Tea", "Hawaiian"],
        "priceRange": "€€",
        "hasMenu": "https://meetea-poke.com/ordina",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Piazzale Dante Alighieri 6",
            "addressLocality": "Carpi",
            "addressRegion": "MO",
            "postalCode": "41012",
            "addressCountry": "IT"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 44.7833,
            "longitude": 10.8833
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday"],
                "opens": "10:30",
                "closes": "22:30"
            },
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Sunday"],
                "opens": "11:00",
                "closes": "22:30"
            }
        ],
        "sameAs": []
    }
    </script>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800&display=swap" rel="stylesheet">
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
