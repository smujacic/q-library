import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersAndRoles1703789209278 implements MigrationInterface {
    name = 'UsersAndRoles1703789209278'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastname" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastname" SET NOT NULL`);
    }

}
