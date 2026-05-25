# MeeTea Poke - APK Stampante Sunmi

APK Android per la stampa automatica degli ordini sul Sunmi V2S.

## Come buildare

```bash
cd android
./gradlew assembleDebug
# APK in: app/build/outputs/apk/debug/app-debug.apk
```

Oppure aprire la cartella `android/` in Android Studio e fare **Build → Build Bundle(s) / APK(s) → Build APK(s)**.

## Come installare sul Sunmi

```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

Oppure copiare l'APK nel browser del device e aprirlo (richiede "Origini sconosciute" abilitato).

## Configurazione

All'avvio l'app mostra la schermata di configurazione:

| Campo        | Valore                                             |
| ------------ | -------------------------------------------------- |
| URL base API | `https://meetea-poke.com`                          |
| Bearer Token | Valore di `PRINT_API_TOKEN` dal `.env` del backend |

Dopo aver salvato, il servizio parte in background e fa polling ogni 3 secondi.

## Comportamento

1. `GET /api/print-queue` → recupera ordini non ancora stampati
2. Per ogni ordine → stampa scontrino via Sunmi Printer SDK (AIDL)
3. `POST /api/orders/{id}/stampa` → marca l'ordine come stampato

## Note tecniche

- Il `PrintService` è un **Foreground Service** - sopravvive al background kill di Android
- Il binding al printer service Sunmi avviene via AIDL (`IWoyouService`) preinstallato su SUNMI OS
- Se la stampante non è disponibile al momento del polling, lo scontrino viene saltato (non accodato)
- Il token di stampa è separato dall'`ADMIN_TOKEN` del pannello web
