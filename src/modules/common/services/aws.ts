import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as path from 'path';
import * as sharp from 'sharp';
import imageSize from 'image-size';
import { BUCKET_NAME } from 'src/settings';

@Injectable()
export class AwsService {
  logger: Logger;
  sizes: string[];
  constructor() {
    this.logger = new Logger('AwsService');
    this.sizes = ['750x600', '180x180'];
  }

  async uploadImages(files: Express.Multer.File[]) {
    try {
      return Promise.all(
        files.map(file => {
          if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg')
            throw new BadRequestException('some-file-is-not-image');

          return this.uploadS3(file);
        })
      );
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Error uploading file to S3');
    }
  }

  async uploadImage(file: Express.Multer.File) {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') throw new BadRequestException('is-not-image');

    try {
      return this.uploadS3(file);
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Error uploading file to S3');
    }
  }

  async uploadS3(file: Express.Multer.File, dir = 'remainder', convertToJPG = true) {
    try {
      let image: sharp.Sharp;
      let contentType: string;

      const bucket = this.getBucketName();
      const { originalname } = file;

      let filePath = `${dir}/${Date.now()}-${this.generateRandomString(originalname.length)}`;

      if (convertToJPG) {
        image = sharp(file.buffer).jpeg({ quality: 90 });
        filePath = filePath.concat('.jpeg');
        contentType = 'image/jpeg';
      } else {
        image = sharp(file.buffer);
        contentType = file.mimetype;

        const imageMetadata = await image.metadata();
        filePath = filePath.concat(`.${imageMetadata.format}`);
      }

      if (imageSize(file.buffer).width > 1000) {
        image
          .resize({
            width: 1000,
            fit: sharp.fit.inside
          })
          .withMetadata();
      }

      const buffer = await image.toBuffer();

      const params = {
        Bucket: bucket,
        Key: filePath,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read'
      };

      await this.resizeImg(image, filePath);
      const s3File = await this.upload(params);

      return { url: s3File.Location, key: s3File.Key };
    } catch (e) {
      console.error(e);
      throw new BadRequestException('upload-failed');
    }
  }

  async upload(params: S3.PutObjectRequest): Promise<S3.ManagedUpload.SendData> {
    try {
      const s3 = this.getS3();

      return s3.upload(params).promise();
    } catch (e) {
      this.logger.error(e);
    }
  }

  generateRandomString(length: number) {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabclubydefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  getBucketName(): string {
    return BUCKET_NAME;
  }

  getS3(): S3 {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
  }

  async resizeImg(image: sharp.Sharp, location: string) {
    for (const size of this.sizes) {
      const dimensions = size.split('x');
      const ext = path.extname(location);
      const newPathName = `${location.split(ext)[0]}-${size}${ext}`;

      const buffer = await image
        .resize({
          width: Number(dimensions[0]),
          height: Number(dimensions[1]),
          fit: sharp.fit.inside,
          withoutEnlargement: true
        })
        .withMetadata()
        .toBuffer();

      const params = {
        Bucket: this.getBucketName(),
        Key: newPathName,
        Body: buffer,
        ContentType: 'image/jpeg',
        ACL: 'public-read'
      };

      await this.upload(params);
    }
  }
}
