import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class alterColumnOffer1637954252374 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ${await queryRunner.getCurrentDatabase()}.offers MODIFY COLUMN price varchar(15) DEFAULT NULL NULL;`
    );

    // await queryRunner.changeColumn(
    //   'offers',
    //   'price',
    //   new TableColumn({
    //     name: 'price',
    //     type: 'varchar(15)'
    //   })
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'offers',
      'price',
      new TableColumn({
        name: 'price',
        type: 'float'
      })
    );
  }
}
