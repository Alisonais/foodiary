import { Meal } from '@aplication/entities/Meal';
import { ResourceNotFound } from '@aplication/errors/application/ResourceNotFound';
import { MealRepository } from '@infra/database/dynamo/repositories/MealRepository';
import { MealsFileStorgeGateway } from '@infra/gateways/MealsFileStorgeGateway';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class GetMealByIdUseCase {

  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsFileStorgeGateway: MealsFileStorgeGateway,
  ) {}

  async execute({
    accountId,
    mealId,
  }: GetMealByIdUseCase.Input): Promise<GetMealByIdUseCase.Output> {
    const meal = await  this.mealRepository.findById({ accountId, mealId });

    if(!meal) {
      throw new ResourceNotFound('Meal not found.');
    }

    const inputFileURL = this.mealsFileStorgeGateway.getFileUrl(meal.inputFileKey);
    return {
      meal: {
        id: meal.id,
        createdAt: meal.createdAt,
        name: meal.name,
        icon: meal.icon,
        foods: meal.foods,
        status: meal.status,
        inputFileURL,
        inputType: meal.inputType,
      },
    };
  };
}

export namespace GetMealByIdUseCase {
  export type Input = {
    accountId: string;
    mealId: string;
  };

  export type Output = {
    meal: {
      id: string;
      status: Meal.Status;
      inputType: Meal.InputType;
      inputFileURL: string;
      name: string;
      icon: string;
      foods: Meal.Food[];
      createdAt: Date;
    };
  };
}
