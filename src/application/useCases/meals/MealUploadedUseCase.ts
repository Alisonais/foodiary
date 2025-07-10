import { Meal } from '@aplication/entities/Meal';
import { ResourceNotFound } from '@aplication/errors/application/ResourceNotFound';
import { MealRepository } from '@infra/database/dynamo/repositories/MealRepository';
import { MealsFileStorgeGateway } from '@infra/gateways/MealsFileStorgeGateway';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class MealUploadedUseCase {

  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsFileStorgeGateway: MealsFileStorgeGateway,
  ) { }

  async execute({ fileKey }: MealUploadedUseCase.Input): Promise<MealUploadedUseCase.Output> {
    const {
      accountId,
      mealId,
    } = await this.mealsFileStorgeGateway.getFileMetadata({ fileKey });

    const meal = await this.mealRepository.findById({
      accountId,
      mealId,
    });

    if (!meal) {
      throw new ResourceNotFound('Meal not found.');
    }

    meal.status = Meal.Status.QUEUED;

    await this.mealRepository.save(meal);

    console.log(JSON.stringify(meal, null, 2));
  }
}
export namespace MealUploadedUseCase {
  export type Input = {
    fileKey: string;
  }
  export type Output = void;
}
