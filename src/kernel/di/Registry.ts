import { Constructor } from '@shared/types/Contructor';

export class Registry {

  private static instance: Registry | undefined;

  static getInstance() {
    if(!this.instance){
      this.instance = new Registry();
    }

    return this.instance;
  };

  private constructor(){};

  private readonly providers = new Map<string, Registry.Provider>();
  register(impl: Constructor) {
    const token = impl.name;

    if (this.providers.has(token)) {
      throw new Error(`${token} is already registred in the registry.`);
    }

    const deps = Reflect.getMetadata('design:paramtypes', impl) ?? [];
    //  const deps = paramTypes.filter(boolean);

    this.providers.set(token, { impl, deps });
  }

  resolve<TImpl extends Constructor>(impl: TImpl): InstanceType<TImpl> {
    const token = impl.name;
    const provider = this.providers.get(token);

    if (!provider) {
      throw new Error(`${token} is not regidtered.`);
    }

    const deps = provider.deps.map(dep => this.resolve(dep));
    const instance = new provider.impl(...deps);

    return instance;
  }
}

export namespace Registry {
  export type Provider = {
    impl: Constructor;
    deps: Constructor[];
  }
}
