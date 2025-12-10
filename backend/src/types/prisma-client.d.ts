declare module '@prisma/client' {
  export type SortOrder = 'asc' | 'desc';

  export type User = {
    id: number;
    email: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
  };

  export const Prisma: {
    SortOrder: {
      asc: SortOrder;
      desc: SortOrder;
    };
  };

  export namespace Prisma {
    export type LogLevel = 'query' | 'info' | 'warn' | 'error';

    export interface PrismaClientOptions {
      log?: LogLevel[];
    }

    export type UserCreateInput = {
      email: string;
      name?: string | null;
      createdAt?: Date | string;
      updatedAt?: Date | string;
    };

    export type UserOrderByWithRelationInput = {
      id?: SortOrder;
      email?: SortOrder;
      name?: SortOrder;
      createdAt?: SortOrder;
      updatedAt?: SortOrder;
    };
  }

  export class PrismaClient {
    constructor(options?: Prisma.PrismaClientOptions);

    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $on(event: 'beforeExit', callback: () => Promise<void> | void): void;

    user: {
      findMany(args?: {
        orderBy?:
          | Prisma.UserOrderByWithRelationInput
          | Prisma.UserOrderByWithRelationInput[];
      }): Promise<User[]>;
      create(args: { data: Prisma.UserCreateInput }): Promise<User>;
    };
  }
}
