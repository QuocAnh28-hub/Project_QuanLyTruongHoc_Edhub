import { AppError, AppException } from '../errors';
import { TransformFnParams } from 'class-transformer';

const MAX_LENGTH = 100;

export function safeParseAndMapIdList<T = any>(lookupMap: Record<number, T>) {
  return ({ value: rawInput }: TransformFnParams): T[] | null | undefined => {
    if (rawInput === null) return null;
    if (rawInput === undefined) return undefined;

    if (Array.isArray(rawInput) && rawInput.length > MAX_LENGTH) {
      throw new AppError(AppException.ARRAY_MAX_LENGTH);
    }

    const rawItems = Array.isArray(rawInput)
      ? rawInput
      : String(rawInput).split(',').slice(0, MAX_LENGTH);

    const mappedItems = rawItems
      .map((raw) => {
        const id = Number(raw);
        return lookupMap[id];
      })
      .filter(Boolean);

    return mappedItems.length > 0 ? mappedItems : undefined;
  };
}

export function safeParseIdList() {
  return ({
    value: rawInput,
  }: TransformFnParams): number[] | null | undefined => {
    if (rawInput === null) return null;
    if (rawInput === undefined) return undefined;

    if (Array.isArray(rawInput) && rawInput.length > MAX_LENGTH) {
      throw new AppError(AppException.ARRAY_MAX_LENGTH);
    }

    const rawItems = Array.isArray(rawInput)
      ? rawInput
      : String(rawInput).split(',').slice(0, MAX_LENGTH);

    const ids = rawItems.map((raw) => Number(raw)).filter((id) => !isNaN(id));

    return ids.length > 0 ? ids : undefined;
  };
}
