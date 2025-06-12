import { AuthGateway } from '@infra/gateways/AuthGateway';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class SignUpUseCase {
  constructor(private readonly authGateway: AuthGateway) { }

  async execute({
    email,
    password,
  }: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {

    await this.authGateway.SignUp({ email, password });

    const {
      accessToken,
      refreshToken,
    } = await this.authGateway.SignIn({ email, password });

    // salvar o externalId no banco

    return {
      accessToken,
      refreshToken,
    };
  }
}

export namespace SignUpUseCase {
  export type Input = {
    email: string;
    password: string;
  }

  export type Output = {
    accessToken: string;
    refreshToken: string;
  }
}
