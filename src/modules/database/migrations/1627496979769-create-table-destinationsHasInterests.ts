import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableDestinationsHasInterests1627496979769 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('destinationsHasInterests');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'destinationsHasInterests',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'destinationId',
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
      'destinationsHasInterests',
      new TableForeignKey({
        columnNames: ['destinationId'],
        referencedTableName: 'destinations',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
    await queryRunner.createForeignKey(
      'destinationsHasInterests',
      new TableForeignKey({
        columnNames: ['interestId'],
        referencedTableName: 'interests',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('destinationsHasInterests');
  }
}
