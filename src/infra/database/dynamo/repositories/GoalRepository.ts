import { Goal } from '@aplication/entities/Goal';
import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { dynamoCient } from '@infra/clients/dynamoClient';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { GoalItem } from '../items/GoalItem';

@Injectable()
export class GoalRepository {

  constructor(private readonly config: AppConfig) {}

  getPutCommandInput(goal: Goal): PutCommandInput {
      const goalItem = GoalItem.fromEntity(goal);

      return {
        TableName: this.config.db.dynamodb.mainTable,
        Item: goalItem.toItem(),
      };
    }

    async create(goal: Goal): Promise<void> {
      await dynamoCient.send(
        new PutCommand(this.getPutCommandInput(goal)),
      );
    }
}
