import { Controller } from '@aplication/contracts/Controller';
import { UpdateGoalUseCase } from '@aplication/useCases/goals/UpdateGoalUseCase';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/Schema';
import { UpdateGoalBody, updateGoalSchema } from './Schema/updateProfileSchema';

@Injectable()
@Schema(updateGoalSchema)
export class UpdateGoalController extends Controller<'private', UpdateGoalController.Response> {

  constructor(private readonly updateGoalUseCase: UpdateGoalUseCase) {
    super();
  }

  protected override async handle({
    accountId,
    body,
  }: Controller.Request<'private', UpdateGoalBody>): Promise<Controller.Response<UpdateGoalController.Response>> {

    const {
      calories,
      carbohydrates,
      proteins,
      fats,
    } = body;

    await this.updateGoalUseCase.execute({
      accountId,
      calories,
      carbohydrates,
      proteins,
      fats,
    });

    return {
      statusCode: 204,
    };
  };
};

export namespace UpdateGoalController {
  export type Response = null;
}
