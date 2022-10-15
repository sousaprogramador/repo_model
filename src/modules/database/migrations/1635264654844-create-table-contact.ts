import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableContact1635264654844 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('contact');
    if (hasTable) return;

    await queryRunner.createTable(
      new Table({
        name: 'contact',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'subject',
            type: 'enum',
            enum: [
              'help',
              'partnership',
              'suggestion',
              'problem',
              'story',
              'fakeAccount',
              'minor',
              'hateSpeech',
              'invalidAccount',
              'porn',
              'other'
            ],
            isNullable: true,
            default: null
          },
          {
            name: 'complaint',
            type: 'boolean',
            default: false
          },
          {
            name: 'description',
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
            name: 'userId',
            type: 'int'
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      'contact',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('contact');
  }
}
