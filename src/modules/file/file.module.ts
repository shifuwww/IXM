import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/entities';
import { FileService } from './file.service';
import { S3ClientService } from 'src/core/storage/storage.service';
import { FileController } from './file.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [FileController],
  providers: [FileService, S3ClientService],
  exports: [FileService],
})
export class FileModule {}
