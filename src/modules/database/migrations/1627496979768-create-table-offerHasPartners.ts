import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableOfferHasPartners1627496979768 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('offerHasPartners');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'offerHasPartners',
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
            name: 'partnerId',
            type: 'int',
            isPrimary: true
          }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'offerHasPartners',
      new TableForeignKey({
        columnNames: ['offerId'],
        referencedTableName: 'offers',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
    await queryRunner.createForeignKey(
      'offerHasPartners',
      new TableForeignKey({
        columnNames: ['partnerId'],
        referencedTableName: 'partners',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('offerHasPartners');
  }
}
