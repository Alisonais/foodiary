import { Controller } from '@aplication/contracts/Controller';
import { ApplicationError } from '@aplication/errors/application/applicationError';
import { ErrorCode } from '@aplication/errors/ErrorCode';
import { HttpError } from '@aplication/errors/http/HttpError';
import { UserNotFoundException } from '@aws-sdk/client-cognito-identity-provider';
import { lambdaBodyParser } from '@main/utils/lambdaBodyparser';
import { lambdaErrorResponse } from '@main/utils/lambdaErrorResponse';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { ZodError } from 'zod';

export function lambdaHttpAdapter(controller: Controller<unknown>) {
  return async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
      const body = lambdaBodyParser(event.body);
      const params = event.pathParameters ?? {};
      const queryParams = event.queryStringParameters ?? {};

      const response = await controller.execute({
        body,
        params,
        queryParams,
      });

      return {
        statusCode: response.statusCode,
        body: response.body ? JSON.stringify(response.body) : undefined,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return lambdaErrorResponse({
          statusCode: 400,
          code: ErrorCode.VALIDATION,
          message: error.issues.map(issue => ({
            field: issue.path.join('.'),
            error: issue.message,
          })),
        });
      }

      if(error instanceof HttpError){
        return lambdaErrorResponse(error);
      }

      if(error instanceof ApplicationError){
        return lambdaErrorResponse({
          statusCode: error.statusCode ?? 400,
          code: error.code,
          message: error.message,
        });
      }

      // alison
      if(error instanceof UserNotFoundException){
        return lambdaErrorResponse({
          statusCode: 401,
          code: ErrorCode.USER_NOT_FOUND_EXCEPTION,
          message: error.message,
        });
      }

      // eslint-disable-next-line no-console
      console.log({ error });

      return lambdaErrorResponse({
        statusCode: 500,
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error.',
      });
    }
  };
}
