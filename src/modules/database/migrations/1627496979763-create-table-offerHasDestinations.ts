import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableOfferHasDestinations1627496979763 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('offerHasDestinations');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'offerHasDestinations',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'offerId',
            type: 'int',
            isPrimary: true
          },
          {
            name: 'destinationId',
            type: 'int',
            isPrimary: true
          }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'offerHasDestinations',
      new TableForeignKey({
        columnNames: ['offerId'],
        referencedTableName: 'offers',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
    await queryRunner.createForeignKey(
      'offerHasDestinations',
      new TableForeignKey({
        columnNames: ['destinationId'],
        referencedTableName: 'destinations',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('offerHasDestinations');
  }
}
