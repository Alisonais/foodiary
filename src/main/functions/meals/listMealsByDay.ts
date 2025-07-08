import 'reflect-metadata';

import { ListMealsByDayController } from '@aplication/controllers/meals/ListMealsByDayController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(ListMealsByDayController);

export const handler = lambdaHttpAdapter(controller);
