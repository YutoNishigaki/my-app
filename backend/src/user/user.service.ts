import { Injectable } from '@nestjs/common';
import { Prisma, User as UserModel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<UserModel[]> {
    return this.prisma.user.findMany({ orderBy: { id: 'asc' } });
  }

  create(data: Prisma.UserCreateInput): Promise<UserModel> {
    return this.prisma.user.create({ data });
  }
}
