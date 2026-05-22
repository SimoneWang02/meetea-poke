## TODO / BUGS

1. SQLSTATE[23000]: Integrity constraint violation: 1062 Duplicate entry 'ORD-001' for key 'orders.orders_numero_ordine_unique' (Connection: mysql, Host: mysql, Port: 3306, Database: meeteapoke, SQL: insert into `orders` (`numero_ordine`, `nome_cliente`, `telefono`, `orario_ritiro`, `note`, `stato`, `updated_at`, `created_at`) values (ORD-001, 123, 123, 21:00, ?, nuovo, 2026-05-22 18:38:10, 2026-05-22 18:38:10))
   (questo si conferma un ordine)

2. personalizzare un boba con un solo topping da 0,50€ viene calcolato bene nella modale MA NON nel carello.
