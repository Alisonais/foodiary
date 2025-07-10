import { Meal } from '@aplication/entities/Meal';
import { HeadObjectCommand } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { s3Client } from '@infra/clients/s3Client';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { minutesToSeconds } from '@shared/utils/minutesToSeconds';
import KSUID from 'ksuid';

@Injectable()
export class MealsFileStorgeGateway {

  constructor(private readonly config: AppConfig) { }

  static generateInputFileKey({
    accountId,
    inputType,
  }: MealsFileStorgeGateway.generateInputFileKeyParams): string {
    const extension = inputType === Meal.InputType.AUDIO ? 'm4a' : 'jpeg';
    const fileName = `${KSUID.randomSync().string}.${extension}`;

    return `${accountId}/${fileName}`; //1:56
  }

  getFileUrl(fileKey: string) {
    return `https://${this.config.cdn.mealsCDN}/${fileKey}`;
  };

  async createPost({
    mealId,
    accountId,
    file,
  }: MealsFileStorgeGateway.CreateBucketPOSTParams): Promise<MealsFileStorgeGateway.CreatePOSTResult> {

    const bucket = this.config.storage.mealsBuket;
    const contentType = file.inputType === Meal.InputType.AUDIO ? 'audio/m4a' : 'image/jpeg';

    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: bucket,
      Key: file.key,
      Expires: minutesToSeconds(5),
      Conditions: [
        { bucket },
        ['eq', '$key', file.key],
        ['eq', '$Content-Type', contentType],
        ['content-length-range', file.size, file.size],
      ],
      Fields: {
        'x-amz-meta-mealid': mealId,
        'x-amz-meta-accountid': accountId,
      },
    });
    const uploadSignature = Buffer.from(
      JSON.stringify({
        url,
        fields: {
          ...fields,
          'Content-Type': contentType,
        },
      }),
    ).toString('base64');

    return { uploadSignature };
  }

  async getFileMetadata({
    fileKey,
  }: MealsFileStorgeGateway.GetFileMetadataParams): Promise<MealsFileStorgeGateway.GetFileMetadataResult> {
    const command = new HeadObjectCommand({
      Bucket: this.config.storage.mealsBuket,
      Key: fileKey,
    });

    const { Metadata = {} } = await s3Client.send(command);

    if (!Metadata.accountid || !Metadata.mealid) {
      throw new Error(`[ getFileMetadata ] Can not process file ${fileKey}`);
    }
    return {
      accountId: Metadata.accountid,
      mealId: Metadata.mealid,
    };
  }

}

export namespace MealsFileStorgeGateway {
  export type generateInputFileKeyParams = {
    accountId: string;
    inputType: Meal.InputType;
  }

  export type CreateBucketPOSTParams = {
    mealId: string;
    accountId: string;
    file: {
      key: string;
      inputType: string;
      size: number;
    }
  }

  export type CreatePOSTResult = {
    uploadSignature: string;
  }

  export type GetFileMetadataParams = {
    fileKey: string;
  }

  export type GetFileMetadataResult = {
    accountId: string;
    mealId: string;
  }
}
