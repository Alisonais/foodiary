import { Controller } from '@aplication/contracts/Controller';
import { BadRequest } from '@aplication/errors/http/BadRequest';
import { ConfirmForgotPasswordUseCase } from '@aplication/useCases/auth/ConfirmForgotPasswordUseCase';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/Schema';
import { confirmForgotPasswordBody, confirmForgotPasswordSchema } from './schemas/confirmForgotPasswordSchema copy';

@Injectable()
@Schema(confirmForgotPasswordSchema)
export class ConfirmForgotPasswordController extends Controller<'public',ConfirmForgotPasswordController.Response> {

  constructor(private readonly confirmForgotPasswordUseCase: ConfirmForgotPasswordUseCase) {
    super();
  }

  protected override async handle(
    { body }: Controller.Request<'public',confirmForgotPasswordBody>,
  ): Promise<Controller.Response<ConfirmForgotPasswordController.Response>> {

    try {
      const { email, confirmationCode, password } = body;

    await this.confirmForgotPasswordUseCase.execute({ email, confirmationCode, password });

    return {
      statusCode: 204,
    };
    } catch {
      throw new BadRequest('failed, tru again.');
    }
  }
}

export namespace ConfirmForgotPasswordController {
  export type Response = null;
}
