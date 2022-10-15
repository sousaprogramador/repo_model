import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableGalleryUsersImages1659987166056 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('galleriesUsersImages');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'galleriesUsersImages',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'galleryId',
            type: 'int'
          },
          {
            name: 'imageId',
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
      'galleriesUsersImages',
      new TableForeignKey({
        columnNames: ['galleryId'],
        referencedTableName: 'galleries',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );

    await queryRunner.createForeignKey(
      'galleriesUsersImages',
      new TableForeignKey({
        columnNames: ['imageId'],
        referencedTableName: 'usersImages',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('galleriesUsersImages');
  }
}
