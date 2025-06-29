import { Controller } from '@aplication/contracts/Controller';
import { Profile } from '@aplication/entities/Profile';
import { GetProfileAndGoalQuery } from '@aplication/query/GetProfileAndGoalQuery';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class GetMeController extends Controller<'private', GetMeController.Response> {

  constructor(private readonly getProfileAndGoalQuery: GetProfileAndGoalQuery) {
    super();
  }

  protected override async handle({ accountId }: Controller.Request<'private'>): Promise<Controller.Response<GetMeController.Response>> {
    const { profile, goal } = await this.getProfileAndGoalQuery.execute({ accountId });
    return {
      statusCode: 200,
      body: {
        profile,
        goal,
      },
    };
  }
}

export namespace GetMeController {
  export type Response = {
    profile: {
      name: string;
      birthDate: string;
      gender: Profile.Gender;
      height: number;
      weight: number;
    },
    goal: {
      calories: number;
      proteins: number;
      carbohydrates: number;
      fats: number;
    }
  }
}
