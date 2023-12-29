import { MigrationInterface, QueryRunner } from "typeorm";

export class UserActive1703814710844 implements MigrationInterface {
    name = 'UserActive1703814710844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isActive"`);
    }

}
