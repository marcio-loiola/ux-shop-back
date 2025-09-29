-- Script para criar um usuário administrador padrão
-- Execute este script após executar as migrations

-- Verificar se o usuário admin já existe e removê-lo se necessário (opcional)
-- DELETE FROM "users" WHERE email = 'admin@example.com';

-- Inserir usuário administrador padrão
INSERT INTO "users" (
    "id",
    "name", 
    "email", 
    "password_hash", 
    "role",
    "created_at",
    "updated_at"
) VALUES (
    gen_random_uuid(),
    'Administrador',
    'admin@example.com',
    '$2a$10$5sgJvBtHAKefn69tGhuzXOPn7VzICAQByYsURJ0J6MV2P/H/j0UDy', -- Senha: Admin@123
    'ADMIN',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

-- Verificar se o usuário foi criado
SELECT 
    id,
    name,
    email,
    role,
    created_at
FROM "users" 
WHERE email = 'admin@example.com';