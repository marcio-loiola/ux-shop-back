import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCart1759073743032 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar enum para status do carrinho
    await queryRunner.query(`
            CREATE TYPE cart_status_enum AS ENUM ('OPEN', 'CLOSED', 'PAID')
        `);

    // Criar tabela carts
    await queryRunner.query(`
            CREATE TABLE "carts" (
                "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                "user_id" UUID NOT NULL,
                "status" cart_status_enum NOT NULL DEFAULT 'OPEN',
                "total_value" DECIMAL(10,2) NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);

    // Criar índice para user_id
    await queryRunner.query(`
            CREATE INDEX "idx_carts_user_id" ON "carts" ("user_id")
        `);

    // Criar índice para status
    await queryRunner.query(`
            CREATE INDEX "idx_carts_status" ON "carts" ("status")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_carts_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_carts_user_id"`);

    // Remover tabela
    await queryRunner.query(`DROP TABLE IF EXISTS "carts"`);

    // Remover enum
    await queryRunner.query(`DROP TYPE IF EXISTS cart_status_enum`);
  }
}
