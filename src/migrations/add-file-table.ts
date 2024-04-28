import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1714305889094 implements MigrationInterface {
  name = 'Migrations1714305889094';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`file\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`key\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`mime_type\` varchar(255) NOT NULL, \`size\` int NOT NULL, \`user_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD CONSTRAINT \`FK_516f1cf15166fd07b732b4b6ab0\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`file\` DROP FOREIGN KEY \`FK_516f1cf15166fd07b732b4b6ab0\``,
    );
    await queryRunner.query(`DROP TABLE \`file\``);
  }
}
