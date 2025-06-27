
export class Profile {
  readonly accountId: string;

  name: string;
  birthDate: Date;
  gender: Profile.Gender;
  height: number;
  weight: number;
  activitylevel: Profile.ActivityLevel;

  readonly createdAt: Date;

  constructor(attr: Profile.attrributes) {
    this.accountId = attr.accountId;
    this.name = attr.name;
    this.birthDate = attr.birthDate;
    this.gender = attr.gender;
    this.height = attr.height;
    this.weight = attr.weight;
    this.activitylevel = attr.activitylevel;
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
    createdAt?: Date;
  }

  export enum Gender {
    MALE = 'MALE',
    FAMALE = 'FEMALE',
  }

  export enum ActivityLevel {
    SEDENTARY = 'SEDENTARY',
    LIGHT = 'LIGHT',
    MODERATE = 'MODERATE',
    HEAVY = 'HEAVY',
    ATHETE = 'ATHETE',
  }
}
