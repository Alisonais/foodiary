import { Injectable } from '@kernel/decorators/injectable';
import { env } from './env';

@Injectable()
export class AppConfig {
  readonly auth: AppConfig.Auth;
  readonly db: AppConfig.Database;
  readonly storage: AppConfig.Storage;

  constructor() {
    this.auth = {
      cognito: {
        client: {
          id: env.COGNITO_CLIENT_ID,
          secret: env.COGNITO_CLIENT_SECRET,
        },
        pool: {
          id: env.COGNITO_POOL_ID,
        },
      },
    };

    this.db = {
      dynamodb: {
        mainTable: env.MAIN_TABLE_NAME,
      },
    };

    this.storage = {
      mealsBuket: env.MEALS_BUCKET,
    };
  };
}

export namespace AppConfig {
  export type Auth = {
    cognito: {
      client: {
        id: string;
        secret: string;
      }
      pool: {
        id: string
      }
    }
  }

  export type Database = {
    dynamodb: {
      mainTable: string;
    }
  }

  export type Storage = {
    mealsBuket: string;
  }
}
