export type AppRecord<K extends keyof any, T> = Record<K, T> & {
  keyFromValue: (value: T) => K;
};

export const appRecord = <K extends keyof any, T>(record: Record<K, T>): AppRecord<K, T> => {
  return {
    ...record,
    keyFromValue: (value: T) => Object.keys(record).find((key) => record[key as K] === value) as K,
  };
};