import { BadRequestException, Injectable } from '@nestjs/common';
import { AwsService } from 'src/modules/common/services/aws';
import * as mime from 'mime-types';
@Injectable()
export class UploadService {
  constructor(private awsService: AwsService) {}

  async uploadSvg(file: Express.Multer.File) {
    if (!file.mimetype.includes('svg')) throw new BadRequestException('is-not-svg');

    try {
      const bucket = this.awsService.getBucketName();

      const { originalname, buffer } = file;

      const filePath = `svg/${Date.now()}-${this.awsService.generateRandomString(originalname.length)}.${mime.extension(
        file.mimetype
      )}`;

      const params = {
        Bucket: bucket,
        Key: filePath,
        Body: buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
      };

      const s3File = await this.awsService.upload(params);

      return {
        url: s3File.Location,
        key: s3File.Key
      };
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Error uploading file to S3');
    }
  }

  async uploadPost(file: Express.Multer.File) {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') throw new BadRequestException('is-not-image');

    try {
      const imageUplaoded = await this.awsService.uploadS3(file, 'posts');

      return {
        uploaded: true,
        url: imageUplaoded.url,
        key: imageUplaoded.key
      };
    } catch (e) {
      return {
        uploaded: false,
        error: {
          message: 'could not upload this image'
        }
      };
      // throw new BadRequestException('Error uploading file to S3');
    }
  }
}
