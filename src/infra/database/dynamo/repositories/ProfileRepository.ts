import { Profile } from '@aplication/entities/Profile';
import { GetCommand, PutCommand, PutCommandInput, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoCient } from '@infra/clients/dynamoClient';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { ProfileItem } from '../items/ProfileItem';

@Injectable()
export class ProfileRepository {

  constructor(private readonly config: AppConfig) { }

  async findByAccountId(accountId: string): Promise<Profile | null> {
    const command = new GetCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: ProfileItem.getPK(accountId),
        SK: ProfileItem.getSK(accountId),
      },
    });
    const { Item: profileItem } = await dynamoCient.send(command);

    if (!profileItem) {
      return null;
    }
    return ProfileItem.toEntity(profileItem as ProfileItem.ItemType);
  }

  async save(profile: Profile) {
    const profileItem = ProfileItem.fromEntity(profile).toItem();
    const command = new UpdateCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: profileItem.PK,
        SK: profileItem.SK,
      },
      UpdateExpression: 'SET #name = :name, #birthDate = :birthDate, #gender = :gender, #height = :height, #weight = :weight',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#birthDate': 'birthDate',
        '#gender': 'gender',
        '#height': 'height',
        '#weight': 'weight',
      },
      ExpressionAttributeValues: {
        ':name': profile.name,
        ':birthDate': profile.birthDate.toISOString(),
        ':gender': profile.gender,
        ':height': profile.height,
        ':weight': profile.weight,
      },
      ReturnValues: 'NONE',
    });

    await dynamoCient.send(command);
  }

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

