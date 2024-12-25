import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '../config/config.service';
import * as path from 'path';
import { MemoryStoredFile } from 'nestjs-form-data';

@Injectable()
export class S3Service {
  private S3: AWS.S3;
  private readonly logger = new Logger(S3Service.name);

  constructor(private readonly configService: ConfigService) {
    this.S3 = new AWS.S3({
      region: this.configService.aws.region,
      credentials: {
        accessKeyId: this.configService.aws.accessKey,
        secretAccessKey: this.configService.aws.secretKey,
      },
    });
  }

  async uploadFile(folder: string, file: MemoryStoredFile) {
    const originalname = file.originalName;
    const ext = path.extname(originalname);

    this.logger.debug('Start upload file to s3');
    const result = await this.S3.upload({
      Key: folder + '/' + uuid() + ext,
      Bucket: this.configService.s3.bucket,
      ContentType: file.mimetype,
      Metadata: {
        'x-amz-meta-content-type': file.mimetype,
        'x-amz-meta-content-disposition': 'inline',
      },
      Body: file.buffer,
    }).promise();
    this.logger.debug('Upload file to s3 success');
    return (
      this.configService.aws.cdn.replace(/\/$/, '') +
      '/' +
      result.Key.replace(/\/^/, '')
    );
  }

  //   async createUploadPresignedUrl(mimetype: string) {
  //     this.logger.log('Generating upload presigned URL');
  //     const parts = mimetype.split('/')[1];
  //     const key = `ai-math/${uuid()}.${parts}`;
  //     const url = await getSignedUrl(
  //       this.s3Client,
  //       new PutObjectCommand({
  //         Bucket: this.configService.s3.bucketName,
  //         Key: key,
  //         ContentType: mimetype,
  //       }),
  //       {
  //         expiresIn: this.configService.s3.expTime,
  //       },
  //     );

  //     return { url, key };
  //   }

  //   async getUploadPresignedUrl(payload: GetPresignedUrlDto): Promise<string> {
  //     this.logger.log('Generating get presigned URL');
  //     const params = {
  //       Bucket: this.configService.s3.bucketName,
  //       Key: payload.key,
  //     };
  //     return await getSignedUrl(this.s3Client, new GetObjectCommand(params), {
  //       expiresIn: this.configService.s3.expTime,
  //     });
  //   }

  //   async uploadFile(file: Express.Multer.File, expireIn: Date) {
  //     const filename = makeUniqueFileName(file.originalname);
  //     const objectKey = 'ai-math/' + filename;
  //     await this.s3Client.send(
  //       new PutObjectCommand({
  //         Bucket: this.configService.s3.bucketName,
  //         Body: file.buffer,
  //         Key: objectKey,
  //         ContentType: file.mimetype,
  //         ContentDisposition: `inline; filename="${filename}"`,
  //         Expires: expireIn,
  //       }),
  //     );
  //     return objectKey;
  //   }

  //   async updateExpire(objectKey: string, expireIn: Date) {
  //     const command = new CopyObjectCommand({
  //       Bucket: this.configService.s3.bucketName,
  //       CopySource: objectKey,
  //       Key: objectKey,
  //       Expires: expireIn,
  //     });
  //     try {
  //       await this.s3Client.send(command);
  //     } catch (error) {}
  //   }

  //   async uploadImageExpertAndGetUrl(file: Express.Multer.File): Promise<string> {
  //     this.logger.log(`Uploading file ${file.originalname} to S3`);

  //     const key = `ai-math/image-expert/` + file.originalname;
  //     await this.s3Client.send(
  //       new PutObjectCommand({
  //         Bucket: this.configService.s3.bucketName,
  //         Body: file.buffer,
  //         Key: key,
  //         ContentType: file.mimetype,
  //         ContentDisposition: `inline; filename="${file.originalname}"`,
  //       }),
  //     );

  //     return `${this.configService.s3.defaultUrl}/${key}`;
  //   }
}
