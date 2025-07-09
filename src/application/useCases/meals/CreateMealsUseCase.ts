import { Meal } from '@aplication/entities/Meal';
import { MealRepository } from '@infra/database/dynamo/repositories/MealRepository';
import { MealsFileStorgeGateway } from '@infra/gateways/MealsFileStorgeGateway';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class CreateMealUseCase {

  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsFileStorgeGateway: MealsFileStorgeGateway,
  ) { }

  async execute({
    accountId,
    file,
  }: CreateMealUseCase.Input): Promise<CreateMealUseCase.Output> {

    const InputFileKey = MealsFileStorgeGateway.generateInputFileKey({
      accountId,
      inputType: file.inputType,
    });

    const meal = new Meal({
      accountId,
      inputType: file.inputType,
      status: Meal.Status.UPLOADING,
      inputFileKey: InputFileKey,
    });

    const [, { uploadSignature }] = await Promise.all([
      this.mealRepository.create(meal),
      this.mealsFileStorgeGateway.createPost({
        mealId: meal.id,
        accountId,
        file: {
          key: InputFileKey,
          size: file.size,
          inputType: file.inputType,
        },

      }),
    ]);

    return {
      mealId: meal.id,
      uploadSignature,
    };
  }
}

export namespace CreateMealUseCase {
  export type Input = {
    accountId: string;
    file: {
      inputType: Meal.InputType,
      size: number,
    }
  }

  export type Output = {
    mealId: string;
    uploadSignature: string;
  }
}
