import { Account } from '@aplication/entities/Account';

export class AccountItem {
  private readonly Keys: AccountItem.Keys;

  static readonly type = 'Account';

  constructor(private readonly attrs: AccountItem.Attrributes) {
    this.Keys = {
      PK: AccountItem.getPK(this.attrs.id),
      SK: AccountItem.getSK(this.attrs.id),
      GSI1PK: AccountItem.getGSI1PK(this.attrs.email),
      GSI1SK: AccountItem.getGSI1SK(this.attrs.email),

    };
  }

  toItem(): AccountItem.ItemType {
    return {
      ...this.Keys,
      ...this.attrs,
      type: AccountItem.type,
    };
  }

  static fromEntity(account: Account) {
    return new AccountItem({
      ...account,
      createdAt: account.createdAt.toISOString(),
    });
  }

  static toEntity(accountItem: AccountItem.ItemType) {
    return new Account({
      id: accountItem.id,
      email: accountItem.email,
      externalId: accountItem.externalId,
      createdAt: new Date(accountItem.createdAt),
    });
  }

  static getPK(accountId: string): AccountItem.Keys['PK'] {
    return `ACCOUNT#${accountId}`;
  }

  static getSK(accountId: string): AccountItem.Keys['SK'] {
    return `ACCOUNT#${accountId}`;
  }

  static getGSI1PK(email: string): AccountItem.Keys['GSI1PK'] {
    return `ACCOUNT#${email}`;
  }

  static getGSI1SK(email: string): AccountItem.Keys['GSI1SK'] {
    return `ACCOUNT#${email}`;
  }
}

export namespace AccountItem {

  export type Keys = {
    PK: `ACCOUNT#${string}`;
    SK: `ACCOUNT#${string}`;
    GSI1PK: `ACCOUNT#${string}`;
    GSI1SK: `ACCOUNT#${string}`;
  };

  export type Attrributes = {
    id: string;
    email: string;
    externalId: string | undefined;
    createdAt: string;

  }

  export type ItemType = Keys & Attrributes & {
    type: 'Account';
  }
}
