import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/lib/database.module';

import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UsersService } from './user.service';

@Module({
  imports: [DatabaseModule],
  providers: [UserRepository, UsersService, UserResolver],
})
export class UserModule {}
