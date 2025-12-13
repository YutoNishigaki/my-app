import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@/generated/prisma/client';
import { DatabaseClient } from '@/lib/database-client';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseClient: DatabaseClient) {}

  findUnique(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.databaseClient.user.findUnique({ where });
  }

  findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.databaseClient.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.databaseClient.user.create({ data });
  }

  update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.databaseClient.user.update({ where, data });
  }

  delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.databaseClient.user.delete({ where });
  }
}
