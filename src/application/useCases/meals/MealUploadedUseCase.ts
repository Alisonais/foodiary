import { Meal } from '@aplication/entities/Meal';
import { ResourceNotFound } from '@aplication/errors/application/ResourceNotFound';
import { MealRepository } from '@infra/database/dynamo/repositories/MealRepository';
import { MealsFileStorgeGateway } from '@infra/gateways/MealsFileStorgeGateway';
import { MealsQueueGateway } from '@infra/gateways/MealsQueueGateway';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class MealUploadedUseCase {

  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsFileStorgeGateway: MealsFileStorgeGateway,
    private readonly mealsQueueGateway: MealsQueueGateway,
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
    await this.mealsQueueGateway.publish({ accountId, mealId });
  }
}
export namespace MealUploadedUseCase {
  export type Input = {
    fileKey: string;
  }
  export type Output = void;
}
