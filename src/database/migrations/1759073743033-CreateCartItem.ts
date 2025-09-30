import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCartItem1759073743033 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela cart_items
    await queryRunner.query(`
            CREATE TABLE "cart_items" (
                "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                "cart_id" UUID NOT NULL,
                "product_id" UUID NOT NULL,
                "quantity" INTEGER NOT NULL,
                "price" DECIMAL(10,2) NOT NULL,
                FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE,
                FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE
            )
        `);

    // Criar índice para cart_id
    await queryRunner.query(`
            CREATE INDEX "idx_cart_items_cart_id" ON "cart_items" ("cart_id")
        `);

    // Criar índice para product_id
    await queryRunner.query(`
            CREATE INDEX "idx_cart_items_product_id" ON "cart_items" ("product_id")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_cart_items_product_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_cart_items_cart_id"`);

    // Remover tabela
    await queryRunner.query(`DROP TABLE IF EXISTS "cart_items"`);
  }
}
