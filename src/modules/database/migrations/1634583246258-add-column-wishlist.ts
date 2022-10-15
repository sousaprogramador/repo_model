import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class addColumnWishlist1634583246258 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ${await queryRunner.getCurrentDatabase()}.wishlists MODIFY COLUMN destinationId int(11) DEFAULT NULL NULL;`
    );
    await queryRunner.addColumn(
      'wishlists',
      new TableColumn({
        name: 'offerId',
        type: 'int',
        isNullable: true,
        default: null
      })
    );
    await queryRunner.createForeignKey(
      'wishlists',
      new TableForeignKey({
        columnNames: ['offerId'],
        referencedTableName: 'offers',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('wishlists', 'offerId');
  }
}
