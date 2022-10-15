import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableDestinations1626186456690 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // // await this.down(queryRunner); // aqui
    const hasTable = await queryRunner.hasTable('destinations');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'destinations',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'name',
            type: 'varchar'
          },
          {
            name: 'status',
            type: 'boolean',
            default: true
          },
          {
            name: 'description',
            type: 'varchar'
          },
          {
            name: 'image',
            type: 'varchar'
          },
          {
            name: 'tags',
            type: 'varchar',
            isNullable: true,
            default: null
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'now()'
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'now()'
          },
          {
            name: 'deletedAt',
            type: 'datetime',
            isNullable: true,
            default: null
          },
          {
            name: 'cityId',
            type: 'int'
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      'destinations',
      new TableForeignKey({
        columnNames: ['cityId'],
        referencedTableName: 'cities',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('destinations');
  }
}
