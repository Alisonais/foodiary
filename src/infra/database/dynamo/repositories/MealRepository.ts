import { Meal } from '@aplication/entities/Meal';
import { GetCommand, PutCommand, PutCommandInput, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoCient } from '@infra/clients/dynamoClient';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { MealItem } from '../items/MealItem';

@Injectable()
export class MealRepository {

  constructor(private readonly config: AppConfig) { }

  async findById({
    mealId,
    accountId,
  }: MealRepository.FindByIdParams): Promise<Meal | null> {
    const command = new GetCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: MealItem.getPK({ mealId, accountId }),
        SK: MealItem.getSK({ mealId, accountId }),
      },
    });

    const { Item: mealItem } = await dynamoCient.send(command);

    if (!mealItem) {
      return null;
    }

    return MealItem.toEntity(mealItem as MealItem.ItemType);
  }

  getPutCommandInput(meal: Meal): PutCommandInput {
    const mealItem = MealItem.fromEntity(meal);

    return {
      TableName: this.config.db.dynamodb.mainTable,
      Item: mealItem.toItem(),
    };
  }

  async create(meal: Meal): Promise<void> {
    await dynamoCient.send(
      new PutCommand(this.getPutCommandInput(meal)),
    );
  }

  async save(meal: Meal) {
    const mealItem = MealItem.fromEntity(meal).toItem();
    const command = new UpdateCommand({
      TableName: this.config.db.dynamodb.mainTable,
      Key: {
        PK: mealItem.PK,
        SK: mealItem.SK,
      },
      UpdateExpression: 'SET #status = :status, #attempts = :attempts, #name = :name, #icon = :icon, #foods = :foods',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#attempts': 'attempts',
        '#name': 'name',
        '#icon': 'icon',
        '#foods': 'foods',

      },
      ExpressionAttributeValues: {
        ':status': meal.status,
        ':attempts': meal.attempts,
        ':name': meal.name,
        ':icon': meal.icon,
        ':foods': meal.foods,
      },
      ReturnValues: 'NONE',
    });

    await dynamoCient.send(command);
  }
}

export namespace MealRepository {
  export type FindByIdParams = {
    mealId: string;
    accountId: string;
  }
}

