import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableDestinationsImages1626186489425 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // // await this.down(queryRunner); // aqui
    const hasTable = await queryRunner.hasTable('destinationsImages');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'destinationsImages',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'path',
            type: 'varchar'
          },
          {
            name: 'destinationId',
            type: 'int'
          }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'destinationsImages',
      new TableForeignKey({
        columnNames: ['destinationId'],
        referencedTableName: 'destinations',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('destinationsImages');
  }
}
