import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class emailConfirmation1645009189757 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns(
            'users', [
                new TableColumn({
                    name: 'emailConfirmationToken',
                    type: 'varchar(6)',
                    default: null,
                    isNullable: true,
                }),
                new TableColumn({
                    name: 'emailConfirmed',
                    type: 'enum',
                    enum: ['NOT_CONFIRMED', 'CONFIRMED', 'REGISTERED_BEFORE'],
                    default: '\'NOT_CONFIRMED\'',
                })
            ]
        );

        await queryRunner.query('UPDATE users SET emailConfirmed = \'REGISTERED_BEFORE\'');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('users', ['emailConfirmationToken', 'emailConfirmed']);
    }

}
