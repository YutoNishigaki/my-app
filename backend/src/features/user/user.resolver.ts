import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './user.service';
import { CreateUserInput, UpdateUserInput, User } from './user.schema';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User, {
    name: 'user',
    nullable: true,
    description: 'ID で単一ユーザーを取得する',
  })
  getUser(@Args('id', { type: () => String }) id: string) {
    return this.usersService.user({ id });
  }

  @Query(() => [User], {
    name: 'users',
    description: 'ユーザー一覧を取得する',
  })
  getUsers(
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
  ) {
    return this.usersService.users({ skip, take });
  }

  @Mutation(() => User, { description: 'ユーザーを新規作成する' })
  createUser(@Args('data') data: CreateUserInput) {
    return this.usersService.createUser(data);
  }

  @Mutation(() => User, { description: 'ユーザー情報を更新する' })
  updateUser(
    @Args('id', { type: () => String }) id: string,
    @Args('data') data: UpdateUserInput,
  ) {
    return this.usersService.updateUser({ where: { id }, data });
  }

  @Mutation(() => User, { description: 'ユーザーを削除する' })
  deleteUser(@Args('id', { type: () => String }) id: string) {
    return this.usersService.deleteUser({ id });
  }
}
