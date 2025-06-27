import { Account } from '@aplication/entities/Account';
import { Goal } from '@aplication/entities/Goal';
import { Profile } from '@aplication/entities/Profile';
import { Injectable } from '@kernel/decorators/injectable';
import { AccountRepository } from '../repositories/AccountRepository';
import { GoalRepository } from '../repositories/GoalRepository';
import { ProfileRepository } from '../repositories/ProfileRepository';
import { unitOfwork } from './UnitOfWork';

@Injectable()
export class SignUpUnitOfWork extends unitOfwork {

    constructor(
      private readonly profileRepository: ProfileRepository,
      private readonly accountRepository: AccountRepository,
      private readonly goalRepository: GoalRepository,
    ) {
      super();
    }

  async run({
    account,
    profile,
    goal,
  }: SignUpUnitOfWork.RunParams) {

    this.addPut(this.accountRepository.getPutCommandInput(account));
    this.addPut(this.profileRepository.getPutCommandInput(profile));
    this.addPut(this.goalRepository.getPutCommandInput(goal));

    await this.commit();
  }
}

export namespace SignUpUnitOfWork {
   export type RunParams = {
    account: Account;
    profile: Profile;
    goal: Goal
  }
}
