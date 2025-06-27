import { PutCommandInput, TransactWriteCommand, TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb';
import { dynamoCient } from '@infra/clients/dynamoClient';

export abstract class unitOfwork {

  private transactItens: NonNullable<TransactWriteCommandInput['TransactItems']> = [];

  protected addPut(putInput: PutCommandInput) {
    this.transactItens.push({ Put: putInput });
  }

  protected async commit() {

    await dynamoCient.send(
      new TransactWriteCommand({
      TransactItems: this.transactItens,
    }),
    );
  }
}
