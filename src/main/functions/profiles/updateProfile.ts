import 'reflect-metadata';

import { UpdateProfileController } from '@aplication/controllers/profiles/UpdateProfileController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(UpdateProfileController);

export const handler = lambdaHttpAdapter(controller);
