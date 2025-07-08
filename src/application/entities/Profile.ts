
export class Profile {
  readonly accountId: string;
  readonly activitylevel: Profile.ActivityLevel;
  readonly goal: Profile.Goal;
  readonly createdAt: Date;
  name: string;
  birthDate: Date;
  gender: Profile.Gender;
  height: number;
  weight: number;

  constructor(attr: Profile.attrributes) {
    this.accountId = attr.accountId;
    this.name = attr.name;
    this.birthDate = attr.birthDate;
    this.gender = attr.gender;
    this.height = attr.height;
    this.weight = attr.weight;
    this.activitylevel = attr.activitylevel;
    this.goal = attr.goal;
    this.createdAt = attr.createdAt ?? new Date();
  }
}

export namespace Profile {
  export type attrributes = {
    accountId: string;
    name: string;
    birthDate: Date;
    gender: Profile.Gender;
    height: number;
    weight: number;
    activitylevel: Profile.ActivityLevel;
    goal: Profile.Goal;
    createdAt?: Date;
  }

  export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
  }

  export enum Goal {
    LOSE = 'LOSE',
    MAINTAIN = 'MAINTAIN',
    GAIN = 'GAIN',
  }

  export enum ActivityLevel {
    SEDENTARY = 'SEDENTARY',
    LIGHT = 'LIGHT',
    MODERATE = 'MODERATE',
    HEAVY = 'HEAVY',
    ATHETE = 'ATHETE',
  }
}
