# Sunmi V2S — Setup stampa ordini

## Contesto
Il Sunmi V2S stampa automaticamente gli ordini nuovi tramite polling all'API Laravel (hosted su Hetzner).
L'app Android fa polling ogni 3 secondi, stampa gli ordini non ancora stampati, poi li marca come stampati.

---

## Step 1 — Verifica device alla ricezione

1. Accendi il device
2. Vai in `Impostazioni → Sicurezza` — verifica che non ci sia nessuna voce "Amministratore dispositivo" o "Device Policy" attiva (residuo MDM Glovo/Foodora)
3. Vai in `Impostazioni → Sicurezza → Origini sconosciute` — abilita installazione APK di terze parti
4. Connetti il device al Wi-Fi del locale

---

## Step 2 — API backend (Laravel)

Da implementare nel progetto Laravel:

### 2a. Migration
Aggiungere colonna `stampato` (boolean, default `false`) alla tabella `orders`.

### 2b. Variabile d'ambiente
Aggiungere in `.env`:
```
PRINT_API_TOKEN=<token-segreto-lungo>
```

### 2c. Endpoint da creare

```
GET  /api/print-queue          → ordini con stampato=false, con items
POST /api/orders/{id}/stampa   → setta stampato=true
```

Entrambi protetti da middleware che verifica `Authorization: Bearer <PRINT_API_TOKEN>`.

### 2d. Risposta GET /api/print-queue

```json
[
  {
    "id": 1,
    "numero_ordine": "ORD-001",
    "nome_cliente": "Mario Rossi",
    "orario_ritiro": "14:30",
    "note": "senza cipolla",
    "items": [
      {
        "tipo": "poke",
        "quantita": 1,
        "configurazione": { ... }
      }
    ]
  }
]
```

---

## Step 3 — APK Android

### Stack
- Kotlin
- Retrofit + OkHttp (polling HTTP)
- Sunmi Printer SDK (AIDL, già installato su SUNMI OS)

### Logica principale

```
Service in background:
  loop ogni 3s:
    GET /api/print-queue
    per ogni ordine:
      stampa scontrino via Sunmi SDK
      POST /api/orders/{id}/stampa
```

### Formato scontrino

```
================================
  MEETEA POKE - ORD-001
================================
Cliente: Mario Rossi
Ritiro:  14:30
--------------------------------
1x Poke Bowl
   [dettagli configurazione]
1x Bubble Tea
   [dettagli configurazione]
--------------------------------
Note: senza cipolla
================================
```

### Installazione sul device
Nessun Play Store — installare l'APK via:
- `adb install app.apk` (USB + Android Studio)
- oppure scaricare l'APK dal browser del device

---

## Configurazione app

L'app deve avere una schermata di config con:
- URL base API (es. `https://tuodominio.it`)
- Bearer token (copiare il valore di `PRINT_API_TOKEN`)

---

## Test

1. Crea un ordine dal frontend
2. Verifica che il Sunmi lo stampi entro ~3 secondi
3. Verifica che non venga stampato una seconda volta
