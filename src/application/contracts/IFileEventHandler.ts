export interface IFileEventHandler {
  handle(input: IFileEventHandler.Inuput): Promise<void>;
}

export namespace IFileEventHandler {
  export type Inuput = {
     fileKey: string;
  }
}
