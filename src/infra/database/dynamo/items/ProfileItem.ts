import { Profile } from '@aplication/entities/Profile';
import { AccountItem } from './AccountItem';

export class ProfileItem {
  private readonly Keys: ProfileItem.Keys;

  private readonly type = 'Profile';

  constructor(private readonly attrs: ProfileItem.Attrributes) {
    this.Keys = {
      PK: ProfileItem.getPK(this.attrs.accountId),
      SK: ProfileItem.getSK(this.attrs.accountId),

    };
  }

  toItem(): ProfileItem.ItemType {
    return {
      ...this.Keys,
      ...this.attrs,
      type: this.type,
    };
  }

  static fromEntity(profile: Profile) {
    return new ProfileItem({
      ...profile,
      createdAt: profile.createdAt.toISOString(),
      birthDate: profile.birthDate.toISOString(),
    });
  }

  static toEntity(profileItem: ProfileItem.ItemType) {
    return new Profile({
      accountId: profileItem.accountId,
      name: profileItem.name,
      birthDate: new Date(profileItem.birthDate),
      gender: profileItem.gender,
      height: profileItem.height,
      weight: profileItem.weight,
      activitylevel: profileItem.activitylevel,
      createdAt: new Date(profileItem.createdAt),
    });
  }

  static getPK(accountId: string): ProfileItem.Keys['PK'] {
    return `ACCOUNT#${accountId}`;
  }

  static getSK(accountId: string): ProfileItem.Keys['SK'] {
    return `ACCOUNT#${accountId}#PROFILE`;
  }
}

export namespace ProfileItem {

  export type Keys = {
    PK: AccountItem.Keys['PK'];
    SK: `ACCOUNT#${string}#PROFILE`;

  };

  export type Attrributes = {
    accountId: string;
    name: string;
    birthDate: string;
    gender: Profile.Gender;
    height: number;
    weight: number;
    activitylevel: Profile.ActivityLevel;
    createdAt: string;
  }

  export type ItemType = Keys & Attrributes & {
    type: 'Profile';
  }
}
