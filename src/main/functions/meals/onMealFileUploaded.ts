import 'reflect-metadata';

import { MealUploadedFileEventHandler } from '@aplication/events/files/MealUploadedFileEventHandler';
import { Registry } from '@kernel/di/Registry';
import { lambdaS3Adapter } from '@main/adapters/lambdaS3Adapter';

const eventHandler = Registry.getInstance().resolve(MealUploadedFileEventHandler);

export const handler = lambdaS3Adapter(eventHandler);

