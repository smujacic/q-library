import { MigrationInterface, QueryRunner } from "typeorm";

export class Books1703809553172 implements MigrationInterface {
    name = 'Books1703809553172'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "publicationDate"`);
        await queryRunner.query(`ALTER TABLE "book" ADD "publicationDate" date NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "publicationDate"`);
        await queryRunner.query(`ALTER TABLE "book" ADD "publicationDate" character varying NOT NULL`);
    }

}
