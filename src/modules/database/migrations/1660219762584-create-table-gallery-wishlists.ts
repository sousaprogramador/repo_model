import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableGalleryWishlists1660219762584 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('wishlistsGalleries');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'wishlistsGalleries',
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
            name: 'wishlistId',
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
      'wishlistsGalleries',
      new TableForeignKey({
        columnNames: ['galleryId'],
        referencedTableName: 'galleries',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );

    await queryRunner.createForeignKey(
      'wishlistsGalleries',
      new TableForeignKey({
        columnNames: ['wishlistId'],
        referencedTableName: 'wishlists',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('wishlistsGalleries');
  }
}
