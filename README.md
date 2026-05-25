# MeeTea&Poke - Click & Collect

Applicazione web per ordinazioni d'asporto di poke bowl e bubble tea per
**MeeTea&Poke** (Carpi, MO).

Stack: Laravel 11 + React 19 (Vite) + Tailwind CSS 4 + MySQL.
Sviluppo via **Laravel Sail** (Docker).

## Cosa fa

- **Landing pubblica** (`/`) con menu, orari, contatti.
- **Flusso d'ordine** (`/ordina`) - wizard multi-step per comporre poke
  bowl e bubble tea, raccoglie dati cliente e crea l'ordine.
- **Pannello staff** (`/admin`) - login con password, polling ogni 10s,
  beep su nuovo ordine, gestione stato (nuovo → in_preparazione → pronto).
- **Notifica WhatsApp** al gestore all'arrivo di ogni nuovo ordine
  via Callmebot (gratuito).
- **Nessun pagamento online**, si paga al ritiro.

## Setup (prima volta)

```bash
# 1. Dipendenze PHP e JS
composer install
npm install

# 2. Configurazione ambiente
cp .env.example .env
php artisan key:generate

# 3. Aprire .env e impostare:
#    - WHATSAPP_NUMBER  (numero del negozio con prefisso, es. 393331234567)
#    - WHATSAPP_APIKEY  (apikey Callmebot, vedi sezione dedicata)
#    - ADMIN_PASSWORD   (password per /admin)
#    - ADMIN_TOKEN      (stringa lunga random, es. `openssl rand -hex 32`)
```

## Avvio in sviluppo (Sail)

```bash
# Avvia container Docker (MySQL + PHP)
./vendor/bin/sail up -d

# Crea il database e applica le migrazioni
./vendor/bin/sail artisan migrate

# Avvia il dev server di Vite (in un terminale a parte)
./vendor/bin/sail npm run dev
```

L'app è disponibile su `http://localhost`.

## Build di produzione

```bash
npm run build
php artisan config:cache
php artisan route:cache
```

## Attivare Callmebot per WhatsApp

Callmebot è un servizio gratuito che permette di inviare messaggi WhatsApp
da un'API HTTP senza dover gestire la WhatsApp Business API.

1. Salva nel telefono del gestore il numero **+34 644 59 78 79** come contatto
   "Callmebot".
2. Dal proprio WhatsApp invia il messaggio:
   `I allow callmebot to send me messages`
3. Aspetta la risposta automatica con l'**apikey** (arriva in pochi minuti).
4. Imposta in `.env`:
    - `WHATSAPP_NUMBER` = numero del gestore con prefisso, senza `+` e senza
      spazi (es. `393331234567`)
    - `WHATSAPP_APIKEY` = apikey ricevuta

Se le credenziali non sono impostate, l'invio viene saltato silenziosamente
e l'ordine viene comunque creato a database.

## Configurare l'accesso admin

In `.env`:

```
ADMIN_PASSWORD=unaPasswordCheTiRicordi
ADMIN_TOKEN=stringaLungaRandomDi64Caratteri
```

Suggerimento per generare il token:

```bash
openssl rand -hex 32
```

L'admin entra in `/admin`, digita la password, il backend risponde con il
token che viene tenuto in memoria React per autenticare le chiamate
successive (niente localStorage - al refresh va rifatto il login).

## Struttura del progetto

```
app/
  Http/
    Controllers/   OrderController, AdminController
    Middleware/    AdminAuth
  Models/          Order, OrderItem
  Services/        NotificationService  (Callmebot + estendibile)

database/migrations/   orders + order_items

resources/
  css/app.css
  views/app.blade.php  (layout minimo, monta React)
  js/
    app.jsx            (BrowserRouter)
    bootstrap.js       (axios config)
    lib/               (options, api client, beep)
    pages/             Home, Ordina, Admin
    components/
      steps/           StepTipo, StepPoke, StepBubbleTea,
                       StepRiepilogo, StepDatiCliente, StepConferma
      admin/           OrdineCard, StatoBadge

routes/
  web.php   (catch-all → app.blade.php)
  api.php   (4 endpoint REST)
```

## API

| Metodo | Path                     | Auth   | Descrizione                    |
| ------ | ------------------------ | ------ | ------------------------------ |
| POST   | `/api/orders`            | -      | Crea un nuovo ordine           |
| POST   | `/api/admin/login`       | -      | Restituisce il token admin     |
| GET    | `/api/orders`            | Bearer | Lista ordini del giorno        |
| PATCH  | `/api/orders/{id}/stato` | Bearer | Aggiorna lo stato di un ordine |

L'header per le route protette è `Authorization: Bearer <ADMIN_TOKEN>`.

## Note

- I prezzi non sono mostrati e non vengono gestiti.
- I link Instagram nella landing sono segnaposto, da aggiornare
  in `resources/js/lib/options.js`.
- Il `NotificationService` è strutturato per ospitare in futuro un canale
  aggiuntivo (es. stampa CloudPRNT su stampante Star Micronics mC-Print3)
  senza modificare il resto del codice - basta aggiungere un nuovo metodo
  e richiamarlo dal dispatcher `send()`.
- Il contatore `numero_ordine` riparte da `ORD-001` ogni giorno
  (basato su `whereDate('created_at', today())`).
