import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class userPhoneNumber1646662250716 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'users',
            new TableColumn({
                name: 'phoneNumber',
                type: 'varchar(16)',
                default: null,
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'phoneNumber');
    }

}
