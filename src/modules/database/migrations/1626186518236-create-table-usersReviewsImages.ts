import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableUsersReviewsImages1626186518236 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // // // await this.down(queryRunner); // aqui
    const hasTable = await queryRunner.hasTable('usersReviewsImages');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'usersReviewsImages',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'filename',
            type: 'varchar'
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
            name: 'usersReviewId',
            type: 'int'
          }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'usersReviewsImages',
      new TableForeignKey({
        columnNames: ['usersReviewId'],
        referencedTableName: 'usersReviews',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('usersReviewsImages');
  }
}
