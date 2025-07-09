import { Controller } from '@aplication/contracts/Controller';
import { Meal } from '@aplication/entities/Meal';
import { GetMealByIdUseCase } from '@aplication/useCases/meals/GetMealByIdUseCase';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class GetMealByIdController
  extends Controller<'private', GetMealByIdController.Response> {

  constructor(private readonly getMealByIdUseCase: GetMealByIdUseCase) {
    super();
  }

  protected override async handle({
    accountId,
    params,
  }:GetMealByIdController.Request):
    Promise<Controller.Response<GetMealByIdController.Response>> {

    const { mealId } = params;
    const { meal } = await this.getMealByIdUseCase.execute({
      accountId, mealId,
    });

    return {
      statusCode: 200,
      body: {
        meal,
      },
    };
  }
}

export namespace GetMealByIdController {

  export type Request = Controller.Request<
  'private', Record<string, unknown>, GetMealByIdController.Params
  >;

  export type Params = {
    mealId: string;
  }

  export type Response = {
    meal: {
      id: string,
      createdAt: Date,
      name: string,
      icon: string,
      foods: Meal.Food[],
      status: Meal.Status,
      inputFileURL: string,
      inputType: Meal.InputType,
    },
  }
}
