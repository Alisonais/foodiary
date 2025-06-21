import { ErrorCode } from '../ErrorCode';
import { ApplicationError } from './ApplicationError';

type propMessage = {
  messageError?: string;
}

export class RefreshTokenReused extends ApplicationError {
  public override statusCode = 401;
  public override code: ErrorCode;

  constructor({ messageError = 'Invalid refresh token.' }: propMessage){
    super();

    this.name = 'RefreshTokenReused';
    this.message = messageError;
    this.code = ErrorCode.REFRESH_TOKEN_INVALID;

  }

}
