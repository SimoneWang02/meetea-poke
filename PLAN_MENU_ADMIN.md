# Piano: Menu Gestibile dall'Admin via Filament

## Context

Oggi tutti i prodotti (poke, bubble tea, snacks) sono hardcoded in `resources/js/lib/options.js` (~500 righe di JS). Ogni modifica al menu (aggiungere un boba, cambiare prezzo, marcare sold-out) richiede modifica al codice + deploy. Il database ha solo `orders` e `order_items`. Il cliente vuole gestire autonomamente il menu — aggiungere/rimuovere prodotti, cambiare prezzi, caricare immagini, riordinare la visualizzazione.

**Decisioni confermate:**
- Pannello admin: **Filament v3** a `/admin`.
- Scope iniziale: **solo prodotti** (poke, boba, snack). Orari/eventi/social restano hardcoded.
- Auth: **singolo utente admin** in `users`, password da `ADMIN_PASSWORD`.
- **Validazione prezzi server-side** (oggi il client può inviare prezzi arbitrari).
- Il React `Admin.jsx` esistente (ordini per personale) si sposta a `/staff` per liberare `/admin` a Filament.

---

## Schema database (riferimento)

### POKE
- **`poke_sizes`**: `id, slug, nome, prezzo (5,2), max_proteine, max_green, max_crispy, max_salse, sort_order, active, timestamps`
- **`poke_ingredient_groups`**: `id, slug, nome, prezzo_extra (5,2), sort_order, timestamps` (5 gruppi fissi ma editabili)
- **`poke_ingredients`**: `id, group_id (FK), slug, nome, vegano (bool), sort_order, active, timestamps`

### BOBA
- **`boba_categories`**: `id, slug, nome, sort_order, active, timestamps`
- **`boba_drinks`**: `id, category_id (FK), slug, nome, ingredienti (text nullable), image_path (nullable), top_seller (bool), sort_order, active, timestamps`
- **`boba_drink_sizes`**: `id, drink_id (FK), size (enum M/G), prezzo (5,2)`
- **`boba_topping_groups`**: `id, slug, nome, sort_order, timestamps`
- **`boba_toppings`**: `id, group_id (FK), parent_id (self FK nullable), nome, prezzo (5,2), sort_order, active, timestamps`

### SNACKS
- **`snacks`**: `id, slug, nome, image_path (nullable), sort_order, active, timestamps`
- **`snack_variants`**: `id, snack_id (FK), qty (int), prezzo (5,2), sort_order, timestamps`

### ORDERS (alter)
- aggiungere colonna **`totale (decimal 7,2)`** a `orders`.

---

## Ordine di esecuzione (sequenza completa)

### STEP 0 — Pre-flight

0.1. `git status` deve essere pulito o avere solo modifiche già conosciute. Le modifiche pendenti elencate (`OrderController.php`, `Order.php`, `services.php`, `routes/api.php`, `PrintAuth.php`, migration `add_stampato_to_orders`) si committano prima di iniziare.
0.2. `git checkout -b feat/menu-admin` per isolare il lavoro.
0.3. Verificare che `ADMIN_PASSWORD` sia presente in `.env` (sarà riutilizzata per il seeder).

### STEP 1 — Installazione Filament

1.1. `composer require filament/filament:"^3.0"`
1.2. `php artisan filament:install --panels` → crea `app/Providers/Filament/AdminPanelProvider.php` con path `/admin`.
1.3. In `AdminPanelProvider.php`: confermare `path: 'admin'`, `login()`, `colors([primary: ...])` con i colori del brand.
1.4. In `config/app.php` impostare `'locale' => 'it'`, `'fallback_locale' => 'en'`, `'faker_locale' => 'it_IT'`.

### STEP 2 — Tabella utenti + seeder admin

2.1. `php artisan make:migration create_users_table` con campi standard Laravel: `id, name, email (unique), email_verified_at (nullable), password, remember_token, timestamps`.
2.2. Creare `app/Models/User.php` standard Laravel + `implements FilamentUser` con metodo `canAccessPanel(Panel $panel): bool { return true; }` (singolo utente, non serve check ruoli).
2.3. `php artisan make:seeder AdminUserSeeder`. Implementazione:
   ```php
   User::updateOrCreate(
       ['email' => 'admin@meetea.it'],
       ['name' => 'Admin', 'password' => Hash::make(env('ADMIN_PASSWORD'))]
   );
   ```
2.4. Registrare `AdminUserSeeder::class` in `DatabaseSeeder::run()`.

### STEP 3 — Migrazioni menu (creare nell'ordine corretto, FK dependent)

Creare tutte le migration con `php artisan make:migration ...`. Timestamp `2026_05_24_*`. Ordine di numerazione (per rispettare le FK):

3.1. `create_poke_sizes_table`
3.2. `create_poke_ingredient_groups_table`
3.3. `create_poke_ingredients_table` (FK a `poke_ingredient_groups`)
3.4. `create_boba_categories_table`
3.5. `create_boba_drinks_table` (FK a `boba_categories`)
3.6. `create_boba_drink_sizes_table` (FK a `boba_drinks`)
3.7. `create_boba_topping_groups_table`
3.8. `create_boba_toppings_table` (FK a `boba_topping_groups` + self FK a `boba_toppings`)
3.9. `create_snacks_table`
3.10. `create_snack_variants_table` (FK a `snacks`)
3.11. `add_totale_to_orders_table` (aggiunge `totale decimal(7,2) nullable` — nullable perché ordini esistenti non l'hanno)

### STEP 4 — Eloquent Models

Creare in `app/Models/`:

4.1. `PokeSize` — `$fillable`, casts (prezzo decimal). Niente relazioni.
4.2. `PokeIngredientGroup` — `hasMany(PokeIngredient::class, 'group_id')`.
4.3. `PokeIngredient` — `belongsTo(PokeIngredientGroup::class, 'group_id')`.
4.4. `BobaCategory` — `hasMany(BobaDrink::class)`.
4.5. `BobaDrink` — `belongsTo(BobaCategory::class)`, `hasMany(BobaDrinkSize::class, 'drink_id')`.
4.6. `BobaDrinkSize` — `belongsTo(BobaDrink::class, 'drink_id')`.
4.7. `BobaToppingGroup` — `hasMany(BobaTopping::class, 'group_id')`.
4.8. `BobaTopping` — `belongsTo(BobaToppingGroup::class, 'group_id')`, `belongsTo(BobaTopping::class, 'parent_id')` (parent), `hasMany(BobaTopping::class, 'parent_id')` (gusti).
4.9. `Snack` — `hasMany(SnackVariant::class)`.
4.10. `SnackVariant` — `belongsTo(Snack::class)`.

Aggiornare `Order` model: aggiungere `totale` a `$fillable` e cast `decimal:2`.

### STEP 5 — Seeders di migrazione dati

Convertire l'attuale `resources/js/lib/options.js` in PHP. Una seeder per famiglia.

5.1. `php artisan make:seeder PokeSeeder` — copiare manualmente da `options.js`:
   - 3 record in `poke_sizes` (Small €8.50, Regular €10.50, Large €12.50 — verificare valori esatti in `options.js`).
   - 5 record in `poke_ingredient_groups` con `prezzo_extra` da `POKE_EXTRA_PREZZI` (proteine 1.8, green 1.2, crispy 0.3, salse 1.3, basi 0).
   - N record in `poke_ingredients` per gruppo, con `vegano` dove indicato.

5.2. `php artisan make:seeder BobaSeeder` — più complesso:
   - Insert `boba_categories` (6 categorie da `BOBA_CATEGORIE`).
   - Per ogni categoria → insert `boba_drinks` con `top_seller` e `image_path` (se presente).
   - Per ogni drink → insert `boba_drink_sizes` con M/G e relativi prezzi.
   - Insert `boba_topping_groups` derivati dalla struttura (Pearls, Frutta, Jelly, ecc.).
   - Insert `boba_toppings` singoli + quelli con `gusti` come parent → loop sui gusti come child con `parent_id` del topping padre.

5.3. `php artisan make:seeder SnackSeeder`:
   - 15 record in `snacks` da `SNACKS_LISTA`.
   - Per ogni snack → insert `snack_variants` per ogni opzione `{qty, prezzo}`.

5.4. `php artisan make:seeder MenuSeeder` che chiama `$this->call([PokeSeeder, BobaSeeder, SnackSeeder])`.

5.5. Registrare `MenuSeeder::class` in `DatabaseSeeder::run()`.

5.6. Copiare le immagini da `public/images/snacks/` e `public/images/boba/` a `storage/app/public/menu/snacks/` e `storage/app/public/menu/boba/`. I seeder impostano `image_path = 'menu/snacks/<file>'` (path relativo a `storage/app/public`).

5.7. `php artisan storage:link` per creare il symlink `public/storage` → `storage/app/public`.

### STEP 6 — Run migrate + seed

6.1. `php artisan migrate` (solo le nuove, le esistenti già applicate).
6.2. `php artisan db:seed --class=AdminUserSeeder`.
6.3. `php artisan db:seed --class=MenuSeeder`.
6.4. Verificare manualmente con tinker: `App\Models\PokeSize::count()` ≥ 3, `App\Models\BobaDrink::count()` > 0, ecc.

### STEP 7 — Filament Resources

Per ognuno: `php artisan make:filament-resource <Nome> --generate`. Configurare in `app/Filament/Resources/`:

7.1. **PokeSizeResource** — table reorderable su `sort_order`, toggle `active`, form con prezzo numerico + 4 numerici `max_*`.
7.2. **PokeIngredientGroupResource** — table con prezzo extra editabile inline, RelationManager `IngredientiRelationManager` per gestire ingredienti per gruppo.
7.3. **BobaCategoryResource** — table reorderable, RelationManager `DrinksRelationManager`.
7.4. **BobaDrinkResource** (accessibile sia standalone che via RelationManager) — form con: nome, categoria, ingredienti (Textarea), image (FileUpload + preview, salva in `menu/boba/`), top_seller toggle. RelationManager `SizesRelationManager` per M/G prezzi.
7.5. **BobaToppingGroupResource** — RelationManager `ToppingsRelationManager` con nested per gusti (RelationManager dentro RelationManager non è banale in Filament: usare `Forms\Components\Repeater::make('gusti')` dentro il form del topping per gestire i child con `parent_id`).
7.6. **SnackResource** — form con image upload, RelationManager `VariantsRelationManager` per qty+prezzo.

7.7. NavigationGroups:
   - Group **Poke**: `PokeSizeResource`, `PokeIngredientGroupResource`
   - Group **Bubble Tea**: `BobaCategoryResource`, `BobaDrinkResource`, `BobaToppingGroupResource`
   - Group **Snack**: `SnackResource`

7.8. Labels italiani (`->label('Prezzo')`, `->label('Attivo')`, ecc.) ovunque.

### STEP 8 — Spostare React Admin a `/staff`

8.1. In `resources/js/app.jsx`: cambiare `<Route path="/admin" element={<Admin />} />` → `<Route path="/staff" element={<Admin />} />`.
8.2. Verificare che la catch-all in `routes/web.php` non intercetti `/admin/*` prima di Filament. Filament registra le sue route a boot, quindi il binding `/admin/*` sarà preso da Filament. Testare con `php artisan route:list | grep admin`.
8.3. Se il personale aveva bookmark di `/admin`, aggiungere un redirect 301: `Route::redirect('/admin/old', '/staff')` (opzionale).

### STEP 9 — API `/api/menu`

9.1. `php artisan make:controller MenuController` in `app/Http/Controllers/`.
9.2. Metodo `index()`:
   - `Cache::remember('public.menu', 300, function () { ... })`.
   - Eager load: `PokeSize::active()->ordered()->get()`, `PokeIngredientGroup::with(['ingredients' => fn ($q) => $q->active()->ordered()])->ordered()->get()`, ecc.
   - Ritorna JSON con struttura:
     ```
     {
       "poke": { "sizes": [...], "groups": [...] },
       "boba": { "categories": [{ ...drinks: [...] }], "topping_groups": [...] },
       "snacks": [...]
     }
     ```
9.3. Aggiungere scope `active()` e `ordered()` ai model rilevanti per pulizia.
9.4. Route in `routes/api.php`: `Route::get('menu', [MenuController::class, 'index']);` (pubblica).

### STEP 10 — Cache invalidation

10.1. Creare observer condiviso in `app/Observers/MenuCacheObserver.php` con metodi `saved()` e `deleted()` che fanno `Cache::forget('public.menu')`.
10.2. Registrare l'observer in `AppServiceProvider::boot()` per tutti i model menu:
    ```php
    foreach ([PokeSize::class, PokeIngredient::class, /* ... tutti i model menu ... */] as $model) {
        $model::observe(MenuCacheObserver::class);
    }
    ```

### STEP 11 — Frontend: MenuProvider

11.1. Creare `resources/js/lib/MenuProvider.jsx`:
   - Context `MenuContext` con shape `{ menu, loading, error, reload }`.
   - `useEffect` chiama `axios.get('/api/menu')`, cache localStorage con TTL 1 ora come fallback.
   - Hook `useMenu()` → `useContext(MenuContext)`.
11.2. Wrappare `<App>` in `<MenuProvider>` in `resources/js/app.jsx`.
11.3. Loader durante il fetch iniziale: riutilizzare il loader del hero già esistente (`HeroLoader.jsx` o equivalente — verificare nome esatto al momento dell'implementazione).

### STEP 12 — Refactor componenti che oggi leggono `options.js`

Per ognuno, sostituire l'import statico da `options.js` con `useMenu()`:

12.1. `resources/js/components/order/PokeModal.jsx` — sostituire `POKE_DIMENSIONI`, `POKE_BASI`, `POKE_PROTEINE`, `POKE_GREEN`, `POKE_CRISPY`, `POKE_SALSE`, `POKE_EXTRA_PREZZI` con il subset di `menu.poke`.
12.2. `resources/js/components/order/BobaModal.jsx` — sostituire `BOBA_CATEGORIE`, `BOBA_TOPPING`.
12.3. `resources/js/components/order/SnacksSection.jsx` (e `BobaSection.jsx`) — sostituire `SNACKS_LISTA`, `BOBA_CATEGORIE`.
12.4. Verificare ricorsivamente con `grep -rn "from.*lib/options" resources/js/` tutti gli altri file e refactorare.
12.5. In `options.js` rimuovere gli export migrati. **Lasciare** `ORARI_APERTURA`, `generateSlotsRitiro` (fuori scope).

### STEP 13 — Validazione prezzi server-side

13.1. Creare `app/Services/MenuPriceCalculator.php` con metodo pubblico `calculate(string $tipo, array $configurazione): float`:
   - **`poke`**: trova `PokeSize` per `dimensione.id` (o slug). Base price = `size.prezzo`. Per ogni gruppo (proteine/green/crispy/salse): se `count(items)` > `size.max_<group>`, sovraccosto = (count − max) × `group.prezzo_extra`. Verifica che ogni ingredient ID sia un record valido e `active`.
   - **`bubbletea`**: trova `BobaDrink` per slug + `BobaDrinkSize` per size scelta. Per ogni topping: prezzo dal DB; per gusti, somma il prezzo del child con `parent_id` corretto.
   - **`snack`**: trova `SnackVariant` per `snack_id + qty`.
   - Solleva `InvalidConfigurationException` se qualsiasi ID non esiste o non è attivo.
13.2. Modificare `OrderController@store`:
   - Dopo la validazione del request, prima di salvare in DB: per ogni item chiama `$calculator->calculate(...)` e accumula totale.
   - Salva `totale` su `Order` model.
   - Se il calculator lancia eccezione → ritorna 422 con messaggio.
13.3. Test `tests/Feature/OrderPriceValidationTest.php`:
   - Test base: poke con dimensione Regular + ingredienti entro max → totale corretto.
   - Test extras: poke con proteine extra → totale include sovraccosti.
   - Test ingredient inesistente → 422.
   - Test ingredient inactive → 422.

### STEP 14 — Verifica end-to-end manuale

14.1. `./vendor/bin/sail artisan migrate:fresh --seed` — DB pulito, menu seedato, admin creato.
14.2. `npm run build` (o `npm run dev` in sviluppo) per ricompilare assets React.
14.3. Aprire `http://localhost/admin` → login con `admin@meetea.it` + `ADMIN_PASSWORD` → vedere tutti i prodotti.
14.4. Modificare il prezzo di un boba in Filament → ricaricare home pubblica → prezzo aggiornato (cache invalidata via observer).
14.5. Marcare uno snack come `inactive` → non appare più in `/ordina`.
14.6. Aprire `/staff` → pannello ordini staff funziona come prima (token auth invariata).
14.7. Effettuare un ordine completo (poke + boba + snack) dal client → verificare in DB `order.totale` coerente con prezzi menu.
14.8. Test prezzo manomesso: con DevTools alterare il payload `POST /api/orders` aggiungendo un `prezzo` falso → server deve ignorarlo e calcolare dal DB.
14.9. `./vendor/bin/sail test --filter=OrderPriceValidation`.

### STEP 15 — Commit e PR

15.1. Commit suddivisi per logical unit:
   - `chore: install filament v3 + admin user`
   - `feat(menu): database schema for poke/boba/snacks`
   - `feat(menu): seed existing products from options.js`
   - `feat(admin): filament resources for menu management`
   - `refactor(frontend): consume menu from /api/menu via MenuProvider`
   - `feat(orders): server-side price validation`
   - `refactor: move staff order panel from /admin to /staff`
15.2. PR su `main` con checklist test eseguiti.

---

## File critici

**Nuovi:**
- `app/Providers/Filament/AdminPanelProvider.php` (generato)
- `app/Filament/Resources/*` (6 resource principali + relation managers)
- `app/Http/Controllers/MenuController.php`
- `app/Services/MenuPriceCalculator.php`
- `app/Observers/MenuCacheObserver.php`
- `app/Models/User.php`, `Poke*.php`, `Boba*.php`, `Snack*.php`
- `database/migrations/2026_05_24_*` (11 migration)
- `database/seeders/AdminUserSeeder.php`, `PokeSeeder.php`, `BobaSeeder.php`, `SnackSeeder.php`, `MenuSeeder.php`
- `resources/js/lib/MenuProvider.jsx`
- `tests/Feature/OrderPriceValidationTest.php`

**Modificati:**
- `routes/api.php` (aggiungere `/api/menu`)
- `app/Http/Controllers/OrderController.php` (validazione prezzi)
- `app/Models/Order.php` (campo `totale`)
- `app/Providers/AppServiceProvider.php` (registrazione observer)
- `resources/js/app.jsx` (route `/admin` → `/staff`, wrap `<MenuProvider>`)
- `resources/js/lib/options.js` (rimuovere export prodotti, lasciare orari)
- Componenti React che leggono prodotti: `PokeModal.jsx`, `BobaModal.jsx`, `SnacksSection.jsx`, `BobaSection.jsx`, e tutti i file in `components/steps/` che importano da `options.js`
- `database/seeders/DatabaseSeeder.php`
- `config/app.php` (locale `it`)
- `composer.json` / `composer.lock` / `package.json` / `package-lock.json` (Filament)

---

## Note operative e rischi

- **Token API esistenti** (`PRINT_API_TOKEN`, `ADMIN_TOKEN`) restano invariati — l'admin proprietario passa a session auth Filament, ma stampante e React staff panel continuano col loro bearer token. **Nessuna regressione** sull'integrazione stampante.
- **Backup pre-deploy**: prima del rilascio in prod, esportare la tabella `orders` (dato di valore). Le 11 nuove migration sono additive; l'unica modifica a tabella esistente è `add totale to orders` — colonna nullable, retro-compatibile.
- **Rollback**: in caso di problemi col `MenuProvider`, predisporre fallback: se `/api/menu` fallisce, il provider torna a usare gli export di `options.js` (mantenere quindi gli export come backup commentato durante la transizione iniziale, rimuovere solo dopo verifica in prod).
- **Catch-all React vs Filament**: Filament registra le sue route a boot prima della catch-all `/{any}`. Verificare con `php artisan route:list | grep admin` che `/admin/*` sia preso da Filament e non passi alla view React.
- **Filament + Italian locale**: le label vanno tradotte manualmente nei resource. I messaggi di errore standard sono già coperti da `lang/it` se presente — verificare ed eventualmente pubblicare le lang files Filament.
