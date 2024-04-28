import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
export { Express } from 'express';

@Injectable()
export class S3ClientService {
  private logger = new Logger(S3ClientService.name);
  AWS_S3_BUCKET = this.configService.getOrThrow('AWS_S3_BUCKET');
  private s3 = new S3({
    accessKeyId: this.configService.getOrThrow('AWS_S3_ACCESS_KEY'),
    secretAccessKey: this.configService.getOrThrow('AWS_S3_SECRET_ACCESS_KEY'),
  });

  constructor(private readonly configService: ConfigService) {}

  public async uploadFile(file: Express.Multer.File) {
    const { originalname } = file;
    return await this.s3Upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      originalname,
      file.mimetype,
    );
  }

  public async deleteFile(key: string) {
    return await this.s3Delete(this.AWS_S3_BUCKET, key);
  }

  public async downloadFile(key: string) {
    return await this.s3Download(this.AWS_S3_BUCKET, key);
  }

  private async s3Delete(bucket: string, key: string) {
    const params = {
      Bucket: bucket,
      Key: key,
    };
    try {
      await this.s3.deleteObject(params).promise();
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  private async s3Download(bucket: string, key: string) {
    const params = {
      Bucket: bucket,
      Key: key,
    };
    try {
      const file = await this.s3.getObject(params).promise();
      return file;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  private async s3Upload(
    file: Buffer,
    bucket: string,
    name: string,
    mimetype: string,
  ) {
    const params = {
      Bucket: bucket,
      Key: String(`${uuid()}-${name}`),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: this.configService.getOrThrow('AWS_S3_REGION'),
      },
    };
    try {
      const s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (err) {
      throw err;
    }
  }
}
