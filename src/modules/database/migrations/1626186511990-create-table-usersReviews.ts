import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableUsersReviews1626186511990 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // // // await this.down(queryRunner); // aqui
    const hasTable = await queryRunner.hasTable('usersReviews');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'usersReviews',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'rating',
            type: 'int'
          },
          {
            name: 'evaluation',
            type: 'text'
          },
          {
            name: 'tripDate',
            type: 'date'
          },
          {
            name: 'status',
            type: 'boolean',
            default: true
          },
          // {
          //   name: 'feed',
          //   type: 'boolean',
          //   default: true
          // },
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
            name: 'destinationId',
            type: 'int'
          },
          {
            name: 'userId',
            type: 'int'
          }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'usersReviews',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
    await queryRunner.createForeignKey(
      'usersReviews',
      new TableForeignKey({
        columnNames: ['destinationId'],
        referencedTableName: 'destinations',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('usersReviews');
  }
}
