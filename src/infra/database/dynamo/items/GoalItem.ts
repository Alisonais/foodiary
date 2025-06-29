import { Goal } from '@aplication/entities/Goal';
import { AccountItem } from './AccountItem';

export class GoalItem {
  private readonly Keys: GoalItem.Keys;

  static readonly type = 'Goal';

  constructor(private readonly attrs: GoalItem.Attrributes) {
    this.Keys = {
      PK: GoalItem.getPK(this.attrs.accountId),
      SK: GoalItem.getSK(this.attrs.accountId),

    };
  }

  toItem(): GoalItem.ItemType {
    return {
      ...this.Keys,
      ...this.attrs,
      type: GoalItem.type,
    };
  }

  static fromEntity(goal: Goal) {
    return new GoalItem({
      ...goal,
      createdAt: goal.createdAt.toISOString(),
    });
  }

  static toEntity(goalItem: GoalItem.ItemType) {
    return new Goal({
      accountId: goalItem.accountId,
      calories: goalItem.calories,
      proteins: goalItem.proteins,
      carbohydrates: goalItem.carbohydrates,
      fats: goalItem.fats,
      createdAt: new Date(goalItem.createdAt),
    });
  }

  static getPK(accountId: string): GoalItem.Keys['PK'] {
    return `ACCOUNT#${accountId}`;
  }

  static getSK(accountId: string): GoalItem.Keys['SK'] {
    return `ACCOUNT#${accountId}#GOAL`;
  }
}

export namespace GoalItem {

  export type Keys = {
    PK: AccountItem.Keys['PK'];
    SK: `ACCOUNT#${string}#GOAL`;

  };

  export type Attrributes = {
    accountId: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
    createdAt: string;
  }

  export type ItemType = Keys & Attrributes & {
    type: 'Goal';
  }
}
