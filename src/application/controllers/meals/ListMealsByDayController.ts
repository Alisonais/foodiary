import { Controller } from '@aplication/contracts/Controller';
import { Meal } from '@aplication/entities/Meal';
import { ListMealsByDayQuery } from '@aplication/query/ListMealsByDayQuery';
import { Injectable } from '@kernel/decorators/injectable';
import { CreateMealBody } from './schemas/createMealSchema';
import { listMealsByDaySchema } from './schemas/listMealsByDaySchema';

@Injectable()

export class ListMealsByDayController extends Controller<'private', ListMealsByDayController.Response> {

  constructor(private readonly listMealsByDayQuery: ListMealsByDayQuery) {
    super();
  }

  protected override async handle({
    accountId,
    queryParams,
  }: Controller.Request<'private', CreateMealBody>): Promise<Controller.Response<ListMealsByDayController.Response>> {
    const { date } = listMealsByDaySchema.parse(queryParams);

    const { meals } = await this.listMealsByDayQuery.execute({
      accountId, date,
    });

    return {
      statusCode: 200,
      body: {
        meals,
      },
    };
  }
}

export namespace ListMealsByDayController {
  export type Response = {
    meals: {
      id: string;
      createdAt: string;
      name: string;
      icon: string;
      foods: Meal.Food[];
    }[]
  }
}
