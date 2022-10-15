import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createTableBlogs1627477495900 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('blogs');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'blogs',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'title',
            type: 'varchar'
          },
          {
            name: 'status',
            type: 'boolean',
            default: true
          },
          {
            name: 'content',
            type: 'text'
          },
          {
            name: 'image',
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
          }
          //   {
          //       posts relacionados
          //   }
          //   {
          //       categorias relacionadas
          //   }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('blogs');
  }
}
