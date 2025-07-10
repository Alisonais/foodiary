import KSUID from 'ksuid';

export class Meal {
  readonly id: string;
  readonly accountId: string;
  readonly inputType: Meal.InputType;
  readonly inputFileKey: string;
  readonly createdAt: Date;
  status: Meal.Status;
  attempts: number;
  name: string;
  icon: string;
  foods: Meal.Food[];

  constructor(attr: Meal.attrributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.accountId = attr.accountId;
    this.status = attr.status;
    this.inputType = attr.inputType;
    this.inputFileKey = attr.inputFileKey;
    this.attempts = attr.attempts ?? 0;
    this.name = attr.name ?? '';
    this.icon = attr.icon ?? '';
    this.foods = attr.foods ?? [];
    this.createdAt = attr.createdAt ?? new Date();
  }
}

export namespace Meal {
  export type attrributes = {
    id?: string;
    accountId: string;
    status: Meal.Status;
    inputType: Meal.InputType;
    inputFileKey: string;
    attempts?: number;
    name?: string;
    icon?: string;
    foods?: Meal.Food[];
    createdAt?: Date;
    }

  export enum Status {
    UPLOADING = 'UPLOADING',
    QUEUED = 'QUEUED',
    PROCESSING = 'PROCESSING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
  }

  export enum InputType {
    AUDIO = 'AUDIO',
    PICTURE = 'PICTURE',
  }

  export type Food = {
    name: string;
    quatity: string;
    calories: number;
    proteins: number;
    carbhydrates: number;
    fats: number;
  }
}
