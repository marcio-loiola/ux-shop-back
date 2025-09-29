import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1759073743030 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar enum para roles do usuário
    await queryRunner.query(`
            CREATE TYPE user_role_enum AS ENUM ('ADMIN', 'CLIENT')
        `);

    // Criar tabela users com SQL puro
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                "name" VARCHAR NOT NULL,
                "email" VARCHAR NOT NULL UNIQUE,
                "password_hash" VARCHAR NOT NULL,
                "role" user_role_enum NOT NULL DEFAULT 'CLIENT',
                "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "deleted_at" TIMESTAMP NULL
            )
        `);

    // Criar índice para email (já é unique, mas pode melhorar performance)
    await queryRunner.query(`
            CREATE INDEX "idx_users_email" ON "users" ("email")
        `);

    // Criar índice para soft delete
    await queryRunner.query(`
            CREATE INDEX "idx_users_deleted_at" ON "users" ("deleted_at")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices primeiro
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_deleted_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_email"`);

    // Remover tabela
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);

    // Remover enum
    await queryRunner.query(`DROP TYPE IF EXISTS user_role_enum`);
  }
}
