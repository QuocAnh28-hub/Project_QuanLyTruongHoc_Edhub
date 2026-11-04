# @gedu/shared

This library provides shared resources (decorators, DTOs, enums, errors, types, utils, validators) for the GEdu Core monorepo. Use it to avoid duplication and ensure consistency across modules and services.

## Contents
- **Decorators**: Custom NestJS decorators
- **DTOs**: Shared Data Transfer Objects
- **Enums**: Common enums for status, roles, etc.
- **Errors**: Standardized error classes
- **Types**: Shared TypeScript types
- **Utils**: Utility functions
- **Validators**: Custom class-validator decorators

## Usage

Import from `@gedu/shared` in your modules/services:

```typescript
import { SomeEnum, SomeDto, someUtil } from '@gedu/shared';
```

## Best Practices
- Use shared DTOs and types for cross-module communication
- Extend shared errors for custom error handling
- Add new shared resources here and document them

## Contributing
- Add JSDoc to all new exports
- Update this README when adding new features
- Follow monorepo and NestJS best practices
