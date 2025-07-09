import { IFileEventHandler } from '@aplication/contracts/IFileEventHandler';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class MealUploadedFileEventHandler implements IFileEventHandler {
  async handle({ fileKey }: IFileEventHandler.Inuput): Promise<void> {
    console.log({
      MealUploadedFileEventHandler: fileKey,
    });
  }

}
