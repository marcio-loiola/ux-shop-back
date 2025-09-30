import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProduct1759073743031 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela products com SQL puro
    await queryRunner.query(`
            CREATE TABLE "products" (
                "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                "name" VARCHAR NOT NULL,
                "description" TEXT,
                "price" DECIMAL(10,2) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "deleted_at" TIMESTAMP NULL
            )
        `);

    // Criar índice para name
    await queryRunner.query(`
            CREATE INDEX "idx_products_name" ON "products" ("name")
        `);

    // Criar índice para soft delete
    await queryRunner.query(`
            CREATE INDEX "idx_products_deleted_at" ON "products" ("deleted_at")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices primeiro
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_products_deleted_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_products_name"`);

    // Remover tabela
    await queryRunner.query(`DROP TABLE IF EXISTS "products"`);
  }
}
