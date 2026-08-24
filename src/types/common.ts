type Brand<T, TBrand extends string> = T & {
  readonly __brand: TBrand;
};

export type Id = Brand<string, "Id">;
export type ISODate = Brand<string, "ISODate">;

export type Nullable<T> = T | null;

export interface DateRange {
  startDate: ISODate;
  endDate: Nullable<ISODate>;
  isPresent: boolean;
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
