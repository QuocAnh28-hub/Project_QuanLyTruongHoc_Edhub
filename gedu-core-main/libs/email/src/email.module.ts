import { DynamicModule, Global, Module } from "@nestjs/common";
import type { ModuleMetadata } from "@nestjs/common";
import { EmailService } from "./email.service";

@Global()
@Module({})
export class EmailModule {
  static registerAsync(registerArgs: {
    imports?: ModuleMetadata['imports'],
  } = {}): DynamicModule {
    return {
      module: EmailModule,
      imports: registerArgs.imports ?? [],
      providers: [
        EmailService
      ],
      exports: [EmailService],
    }
  }

  static register(registerArgs: {
    imports?: ModuleMetadata['imports'],
  } = {}): DynamicModule {
    return this.registerAsync(registerArgs);
  }
}