import { Context, HttpRequest } from '@azure/functions';
import { AzureHttpAdapter } from '@nestjs/azure-func-http';
import { createApp } from '../src/main.azure';

export default function (context: Context, req: HttpRequest): void {
  console.log(req);
  AzureHttpAdapter.handle(createApp, context, req);
}
