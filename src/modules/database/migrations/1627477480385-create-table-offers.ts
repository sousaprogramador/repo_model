import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createTableOffers1627477480385 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('offers');
    if (hasTable) return;
    await queryRunner.createTable(
      new Table({
        name: 'offers',
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
            name: 'price',
            type: 'float',
            isNullable: true,
            default: null
          },
          {
            //   Selecionar este campo caso queira que o usuário envie email para fechamento da compra. Caso o usuário tenha que ser redirecionado à URL cadastrada, desmarque essa opção.
            name: 'isReturnEmail',
            type: 'boolean',
            default: false
          },
          {
            name: 'link',
            type: 'varchar',
            isNullable: true
          },
          {
            name: 'tags',
            type: 'varchar',
            isNullable: true,
            default: null
          },
          {
            name: 'startDate',
            type: 'date'
          },
          {
            name: 'endDate',
            type: 'date'
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
          //       categorias relacionadas
          //   }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('offers');
  }
}
