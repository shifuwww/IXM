import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import { S3ClientService } from 'src/core/storage/storage.service';
import { FileEntity } from 'src/entities';
import { Repository } from 'typeorm';
import { FileMapper } from './mapper';
import { FileFilterDto, GetFileDto, FilesPageableResponseDataDto } from './dto';
import { IDownloadFile } from 'src/common/interfaces/file';

@Injectable()
export class FileService {
  private logger = new Logger(FileService.name);

  constructor(
    @InjectRepository(FileEntity)
    private readonly repository: Repository<FileEntity>,
    private readonly s3Service: S3ClientService,
  ) {}

  public async getFileById(id: string) {
    try {
      const file = await this.repository.findOne({
        where: { id },
        relations: { user: true },
      });

      if (!file) {
        throw new NotFoundException('File does not exist!');
      }

      return file;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async getListOfFiles(
    dto: FileFilterDto,
    userId?: string,
  ): Promise<FilesPageableResponseDataDto> {
    const { limit, order, page } = dto;
    try {
      const [data, total] = await this.repository.findAndCount({
        ...(userId && {
          where: {
            user: { id: userId },
          },
        }),
        take: limit,
        skip: dto.countOffset(),
        order: {
          [`${dto.getOrderedField(Object.keys(FileEntity))}`]: order,
        },
      });

      return {
        page: page,
        count: data.length,
        total,
        pageCount: Math.ceil(total / limit),
        data: FileMapper.mapItems(data),
      };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async uploadFile(
    file: Express.Multer.File,
    userId: string,
  ): Promise<GetFileDto> {
    try {
      const s3Data = await this.s3Service.uploadFile(file);
      const newFile = this.repository.create({
        name: file.originalname,
        key: s3Data.Key,
        type: path.extname(file.originalname),
        mimeType: file.mimetype,
        size: file.size,
        user: { id: userId },
      });
      const entity = await this.repository.save(newFile);
      return FileMapper.map(entity);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async updateFile(
    file: Express.Multer.File,
    id: string,
    userId: string,
  ): Promise<GetFileDto> {
    await this.deleteFile(id, userId);
    try {
      const s3Data = await this.s3Service.uploadFile(file);
      const newFile = this.repository.create({
        id: id,
        name: file.originalname,
        key: s3Data.Key,
        type: path.extname(file.originalname),
        mimeType: file.mimetype,
        size: file.size,
        user: { id: userId },
      });
      const entity = await this.repository.save(newFile);
      return FileMapper.map(entity);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async downloadFile(id: string): Promise<IDownloadFile> {
    const file = await this.getFileById(id);
    try {
      const s3Data = await this.s3Service.downloadFile(file.key);
      return { data: s3Data.Body as Buffer, mimeType: file.mimeType };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async deleteFile(id: string, userId: string) {
    const file = await this.getFileById(id);
    try {
      if (file.user.id !== userId) {
        throw new ConflictException('Access denied!');
      }

      await this.s3Service.deleteFile(file.key);
      await this.repository.delete({ id });
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
