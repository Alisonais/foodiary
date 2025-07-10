import { IFileEventHandler } from '@aplication/contracts/IFileEventHandler';
import { MealUploadedUseCase } from '@aplication/useCases/meals/MealUploadedUseCase';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class MealUploadedFileEventHandler implements IFileEventHandler {

  constructor(private readonly mealUploadUseCase: MealUploadedUseCase) { }

  async handle({ fileKey }: IFileEventHandler.Inuput): Promise<void> {

    await this.mealUploadUseCase.execute({ fileKey });

  }

}
