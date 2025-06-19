import { InitiateAuthCommand, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '@infra/clients/cognitoClient';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { createHmac } from 'node:crypto';

@Injectable()
export class AuthGateway {

  constructor(private readonly appConfig: AppConfig) {}

  private clientId = this.appConfig.auth.cognito.client.id;
  private clientSecret = this.appConfig.auth.cognito.client.secret;

  private getSecretHash(email: string): string {
    return createHmac('SHA256', this.clientSecret)
      .update(`${email}${this.clientId}`)
      .digest('base64');
  }

  async SignUp({
    email,
    password,
    internalId,
  }: AuthGateway.SignUpParams): Promise<AuthGateway.SignUpResult> {
    const command = new SignUpCommand({
      ClientId: this.clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'custom:internalId', Value: internalId },
      ],
      SecretHash: this.getSecretHash(email),
    });

    const { UserSub: externalId } = await cognitoClient.send(command);

    if(!externalId){
      throw new Error(`cannot signup user ${email}`);
    }
    return {
      externalId,
    };
  }

  async SignIn({
    email,
    password,
  }: AuthGateway.SignInParams): Promise<AuthGateway.SignInResult> {
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: this.getSecretHash(email),
      },
    });

    const { AuthenticationResult } = await cognitoClient.send(command);

    if(!AuthenticationResult?.AccessToken || !AuthenticationResult.RefreshToken) {
      throw new Error(`cannot authenticate User: ${email}`);
    }

    return {
      accessToken: AuthenticationResult.AccessToken,
      refreshToken: AuthenticationResult.RefreshToken,
    };
  }

}

export namespace AuthGateway {
  export type SignUpParams = {
    email: string;
    password: string;
    internalId: string
  }

  export type SignUpResult = {
    externalId: string;
  }

  export type SignInParams = {
    email: string;
    password: string;
  }

  export type SignInResult = {
    accessToken: string;
    refreshToken: string;
  }
}
