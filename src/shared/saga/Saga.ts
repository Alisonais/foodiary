import { Injectable } from '@kernel/decorators/injectable';

type CompensationFn = () => Promise<void>;

@Injectable()
export class Saga {
  private conpensations: (CompensationFn)[] = [];

  addCompensation(fn: CompensationFn) {
    this.conpensations.unshift(fn);
  }

  async compensate() {
    for await (const compensation of this.conpensations) {
      try {
        await compensation();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    }
  }

  async run<TResult>(fn: () => Promise<TResult>) {
    try {
     return await fn();
    } catch (err) {

      await this.compensate();

      throw err;
    }
  }
}
