import 'reflect-metadata';

import { SignUpController } from '@aplication/controllers/auth/SignUpController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(SignUpController);

export const handler = lambdaHttpAdapter(controller);
