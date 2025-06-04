import { Schema } from '@kernel/decorators/Schema';
import { Controller } from '../contracts/Controller';
import { helloBody, helloSchema } from './schemas/helloSchema';

@Schema(helloSchema)
export class HelloController extends Controller<unknown> {
  protected override async handle(
    request: Controller.Request<helloBody>,
  ): Promise<Controller.Response<unknown>> {

    return {
      statusCode: 200,
      body: {
        parsedBody: request.body,
      },
    };
  }
}
