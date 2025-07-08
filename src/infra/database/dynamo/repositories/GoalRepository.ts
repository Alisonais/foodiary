import { Goal } from '@aplication/entities/Goal';
import { GetCommand, PutCommand, PutCommandInput, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoCient } from '@infra/clients/dynamoClient';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { GoalItem } from '../items/GoalItem';

@Injectable()
export class GoalRepository {

  constructor(private readonly config: AppConfig) { }

  getPutCommandInput(goal: Goal): PutCommandInput {
    const goalItem = GoalItem.fromEntity(goal);

    return {
      TableName: this.config.db.dynamodb.mainTable,
      Item: goalItem.toItem(),
    };
  }

  async findByAccountId(accountId: string): Promise<Goal | null> {
    const command = new GetCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: GoalItem.getPK(accountId),
        SK: GoalItem.getSK(accountId),
      },
    });
    const { Item: goalItem } = await dynamoCient.send(command);

    if (!goalItem) {
      return null;
    }
    return GoalItem.toEntity(goalItem as GoalItem.ItemType);
  }

  async create(goal: Goal): Promise<void> {
    await dynamoCient.send(
      new PutCommand(this.getPutCommandInput(goal)),
    );
  }

  async save(goal: Goal) {
      const goalItem = GoalItem.fromEntity(goal).toItem();
      const command = new UpdateCommand({
        TableName: this.config.db.dynamodb.mainTable,
        Key: {
          PK: goalItem.PK,
          SK: goalItem.SK,
        },
        UpdateExpression: 'SET #calories = :calories, #proteins = :proteins, #carbohydrates = :carbohydrates, #fats = :fats',
        ExpressionAttributeNames: {
          '#calories': 'calories',
          '#proteins': 'proteins',
          '#carbohydrates': 'carbohydrates',
          '#fats': 'fats',
        },
        ExpressionAttributeValues: {
          ':calories': goal.calories,
          ':proteins': goal.proteins,
          ':carbohydrates': goal.carbohydrates,
          ':fats': goal.fats,
        },
        ReturnValues: 'NONE',
      });

      await dynamoCient.send(command);
    }

}
