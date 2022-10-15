import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableUsersReportedReviews1626186543780 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // // // await this.down(queryRunner); // aqui
    const hasTable = await queryRunner.hasTable('usersReportedReviews');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'usersReportedReviews',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'message',
            type: 'text'
          },
          {
            name: 'reason',
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
            name: 'userId',
            type: 'int'
          },
          {
            name: 'usersReviewId',
            type: 'int'
          }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'usersReportedReviews',
      new TableForeignKey({
        columnNames: ['usersReviewId'],
        referencedTableName: 'usersReviews',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
    await queryRunner.createForeignKey(
      'usersReportedReviews',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('operationTokens');
  }
}
