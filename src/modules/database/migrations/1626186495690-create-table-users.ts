import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableUsers1626186495690 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // // await this.down(queryRunner); // aqui

    const hasTable = await queryRunner.hasTable('users');
    if (hasTable) return;

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'name',
            type: 'varchar'
          },
          {
            name: 'email',
            type: 'varchar'
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: true,
            default: null
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
            default: null
          },
          {
            name: 'birthDate',
            type: 'date',
            isNullable: true,
            default: null
          },
          {
            name: 'friendlyName',
            type: 'varchar',
            isNullable: true,
            default: null
          },
          {
            name: 'gender',
            type: 'varchar',
            isNullable: true,
            default: null
          },
          {
            name: 'sexualOrientation',
            type: 'enum',
            enum: ['straight', 'homosexual', 'bisexual', 'shemale', 'other'],
            isNullable: true,
            default: null
          },
          {
            name: 'maritalStatus',
            type: 'enum',
            enum: ['married', 'single', 'divorced', 'relationship', 'open'],
            isNullable: true,
            default: null
          },
          {
            name: 'languages',
            type: 'varchar',
            isNullable: true,
            default: null
          },
          {
            name: 'country',
            type: 'varchar',
            isNullable: true,
            default: null
          },
          {
            name: 'tokenOneSignal',
            type: 'varchar',
            isNullable: true,
            default: null
          },
          {
            name: 'state',
            type: 'varchar',
            isNullable: true,
            default: null
          },
          {
            name: 'city',
            type: 'varchar',
            isNullable: true,
            default: null
          },
          {
            name: 'status',
            type: 'boolean',
            default: true
          },
          {
            name: 'profilePhoto',
            type: 'varchar',
            isNullable: true,
            default: null
          },
          {
            name: 'facebookId',
            type: 'varchar',
            isNullable: true,
            default: null
          },
          {
            name: 'appleId',
            type: 'varchar',
            isNullable: true,
            default: null
          },
          {
            name: 'googleId',
            type: 'varchar',
            isNullable: true,
            default: null
          },
          {
            name: 'chatId',
            type: 'varchar',
            isNullable: true,
            default: null
          },
          {
            name: 'lastLogin',
            type: 'datetime',
            isNullable: true,
            default: null
          },
          {
            name: 'rememberToken',
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
            name: 'relationshipId',
            type: 'int',
            isNullable: true,
            default: null
          },
          {
            name: 'termId',
            type: 'int',
            isNullable: true,
            default: null
          },
          {
            name: 'referralId',
            type: 'int',
            isNullable: true,
            default: null
          },
          {
            name: 'inviteCode',
            type: 'varchar',
            isNullable: true,
            default: null
          },
          {
            name: 'roles',
            type: 'enum',
            enum: ['sysAdmin', 'admin', 'user']
          }
        ]
      })
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['referralId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL'
      })
    );
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['relationshipId'],
        referencedTableName: 'relationships',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL'
      })
    );
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['termId'],
        referencedTableName: 'terms',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL'
      })
    );

    // const sysAdmin = {
    //   name: 'Admin',
    //   email: 'admin@luby.software',
    //   password: '$2b$10$j.lGtZbrZGf3t5WgwyTgue39BvAfX1jTSOwwCBIS0l1FG4OCoXQ42', // Luby2021
    //   roles: 'sysAdmin'
    // };

    // await queryRunner.manager.insert('users', sysAdmin);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
