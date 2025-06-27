import { Profile } from '@aplication/entities/Profile';
import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { dynamoCient } from '@infra/clients/dynamoClient';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { ProfileItem } from '../items/ProfileItem';

@Injectable()
export class ProfileRepository {

  constructor(private readonly config: AppConfig) {}

  getPutCommandInput(profile: Profile): PutCommandInput {
    const profileItem = ProfileItem.fromEntity(profile);

    return {
      TableName: this.config.db.dynamodb.mainTable,
      Item: profileItem.toItem(),
    };
  }

  async create(profile: Profile): Promise<void> {
    await dynamoCient.send(
      new PutCommand(this.getPutCommandInput(profile)),
    );
  }
}
