import { Meal } from '@aplication/entities/Meal';

export class MealItem {
  private readonly Keys: MealItem.Keys;

  static readonly type = 'Meal';

  constructor(private readonly attrs: MealItem.Attrributes) {
    this.Keys = {
      PK: MealItem.getPK({
        mealId: this.attrs.id,
        accountId: this.attrs.accountId,
      }),
      SK: MealItem.getSK({
        mealId: this.attrs.id,
        accountId: this.attrs.accountId,
      }),
      GSI1PK: MealItem.getGSI1PK({
        accountId: this.attrs.accountId,
        createdAt: new Date(this.attrs.createdAt),
      }),
      GSI1SK: MealItem.getGSI1SK(this.attrs.id),

    };
  }

  toItem(): MealItem.ItemType {
    return {
      ...this.Keys,
      ...this.attrs,
      type: MealItem.type,
    };
  }

  static fromEntity(meal: Meal) {
    return new MealItem({
      ...meal,
      createdAt: meal.createdAt.toISOString(),
    });
  }

  static toEntity(mealItem: MealItem.ItemType) {
    return new Meal({
      id: mealItem.id,
      accountId: mealItem.accountId,
      status: mealItem.status,
      attempts: mealItem.attempts,
      inputType: mealItem.inputType,
      inputFileKey: mealItem.inputFileKey,
      name: mealItem.name,
      icon: mealItem.icon,
      foods: mealItem.foods,
      createdAt: new Date(mealItem.createdAt),
    });
  }

  static getPK({
    accountId,
    mealId,
  }: MealItem.PKParams): MealItem.Keys['PK'] {
    return `ACCOUNT#${accountId}#MEAL#${mealId}`;
  }

  static getSK({
    accountId,
    mealId,
  }: MealItem.SKParams): MealItem.Keys['SK'] {
    return `ACCOUNT#${accountId}#MEAL#${mealId}`;
  }

  static getGSI1PK({
    accountId,
    createdAt,
  }: MealItem.GSIPKParams): MealItem.Keys['GSI1PK'] {
    const year = createdAt.getFullYear(); // 1:21
    const month = String(createdAt.getMonth() + 1).padStart(2, '0');
    const day = String(createdAt.getDate()).padStart(2, '0');
    return `MEALS#${accountId}#${year}-${month}-${day}`;
  }

  static getGSI1SK(email: string): MealItem.Keys['GSI1SK'] {
    return `MEAL#${email}`;
  }
}

export namespace MealItem {

  export type Keys = {
    PK: `ACCOUNT#${string}#MEAL#${string}`;
    SK: `ACCOUNT#${string}#MEAL#${string}`;
    GSI1PK: `MEALS#${string}#${string}-${string}-${string}`;
    GSI1SK: `MEAL#${string}`;
  };

  export type Attrributes = {
    id: string;
    accountId: string;
    status: Meal.Status;
    attempts: number;
    inputType: Meal.InputType;
    inputFileKey: string;
    name: string;
    icon: string;
    foods: Meal.Food[];
    createdAt: string;

  }

  export type ItemType = Keys & Attrributes & {
    type: 'Meal';
  }

  export type GSIPKParams = {
    accountId: string;
    createdAt: Date;
  }

  export type PKParams = {
    accountId: string;
    mealId: string;
  }

  export type SKParams = {
    accountId: string;
    mealId: string;
  }
}
