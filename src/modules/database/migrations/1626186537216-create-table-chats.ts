import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableChats1626186537216 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // // // await this.down(queryRunner); // aqui
    const hasTable = await queryRunner.hasTable('chats');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'chats',
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
            name: 'newMessage',
            type: 'boolean'
          },
          {
            name: 'senderId',
            type: 'int'
          },
          {
            name: 'recipientId',
            type: 'int'
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
          }
        ]
      })
    );
    await queryRunner.createForeignKey(
      'chats',
      new TableForeignKey({
        columnNames: ['recipientId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id']
      })
    );
    await queryRunner.createForeignKey(
      'chats',
      new TableForeignKey({
        columnNames: ['senderId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id']
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('chats');
  }
}
