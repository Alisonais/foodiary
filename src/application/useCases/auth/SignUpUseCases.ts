import { Account } from '@aplication/entities/Account';
import { EmailAlreadyInUse } from '@aplication/errors/application/EmailAlreadyinUse';
import { AccountRepository } from '@infra/database/dynamo/repositories/AccountRepository';
import { AuthGateway } from '@infra/gateways/AuthGateway';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly accountRepository: AccountRepository,
  ) { }

  async execute({
    email,
    password,
  }: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {

    const emailAlreadyInUse = await this.accountRepository.findEmail(email);

    if(emailAlreadyInUse) {
      throw new EmailAlreadyInUse();
    }

    const { externalId } = await this.authGateway.SignUp({ email, password });

    const account = new Account({ email, externalId });
    await this.accountRepository.create(account);

    const {
      accessToken,
      refreshToken,
    } = await this.authGateway.SignIn({ email, password });

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
