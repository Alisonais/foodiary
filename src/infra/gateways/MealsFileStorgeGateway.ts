import { Meal } from '@aplication/entities/Meal';
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

  async createPost({
    mealId,
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
}

export namespace MealsFileStorgeGateway {
  export type generateInputFileKeyParams = {
    accountId: string;
    inputType: Meal.InputType;
  }

  export type CreateBucketPOSTParams = {
    mealId: string;
    file: {
      key: string;
      inputType: string;
      size: number;
    }
  }

  export type CreatePOSTResult = {
    uploadSignature: string;
  }
}
