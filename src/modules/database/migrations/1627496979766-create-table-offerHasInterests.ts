import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableOfferHasInterests1627496979766 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('offerHasInterests');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'offerHasInterests',
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
            name: 'interestId',
            type: 'int',
            isPrimary: true
          }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'offerHasInterests',
      new TableForeignKey({
        columnNames: ['offerId'],
        referencedTableName: 'offers',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
    await queryRunner.createForeignKey(
      'offerHasInterests',
      new TableForeignKey({
        columnNames: ['interestId'],
        referencedTableName: 'interests',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('offerHasInterests');
  }
}
