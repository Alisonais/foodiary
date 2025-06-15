import 'reflect-metadata';

import { SignInController } from '@aplication/controllers/auth/SignInController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(SignInController);

export const handler = lambdaHttpAdapter(controller);
