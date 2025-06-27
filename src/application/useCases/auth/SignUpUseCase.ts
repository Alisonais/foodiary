import { Account } from '@aplication/entities/Account';
import { Goal } from '@aplication/entities/Goal';
import { Profile } from '@aplication/entities/Profile';
import { EmailAlreadyInUse } from '@aplication/errors/application/EmailAlreadyinUse';
import { AccountRepository } from '@infra/database/dynamo/repositories/AccountRepository';
import { SignUpUnitOfWork } from '@infra/database/dynamo/uow/SignUpUnitOfWork';
import { AuthGateway } from '@infra/gateways/AuthGateway';
import { Injectable } from '@kernel/decorators/injectable';
import { Saga } from '@shared/saga/Saga';

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly accountRepository: AccountRepository,
    private readonly signUOW: SignUpUnitOfWork,
    private readonly saga: Saga,
  ) { }

  async execute({
    account: {
      email,
      password,
    },
    profile: profileInfo,
  }: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {

    return this.saga.run(async () => {
      const emailAlreadyInUse = await this.accountRepository.findEmail(email);

      if (emailAlreadyInUse) {
        throw new EmailAlreadyInUse();
      }

      const account = new Account({ email });
      const profile = new Profile({
        ...profileInfo,
        accountId: account.id,
      });
      const goal = new Goal({
        accountId: account.id,
        calories: 2500,
        carbohydrates: 500,
        fats: 80,
        proteins: 180,
      });

      const { externalId } = await this.authGateway.SignUp({
        email,
        password,
        internalId: account.id,
      });

      this.saga.addCompensation(() => this.authGateway.deleteUser({ externalId }));

      account.externalId = externalId;
      await this.signUOW.run({
        account,
        profile,
        goal,
      });

      const {
        accessToken,
        refreshToken,
      } = await this.authGateway.SignIn({ email, password });

      return {
        accessToken,
        refreshToken,
      };
    });

  }
}

export namespace SignUpUseCase {
  export type Input = {
    account: {
      email: string;
      password: string;
    },
    profile: {
      name: string;
      birthDate: Date;
      gender: Profile.Gender;
      height: number;
      weight: number;
      activitylevel: Profile.ActivityLevel;
    }
  }

  export type Output = {
    accessToken: string;
    refreshToken: string;
  }
}
