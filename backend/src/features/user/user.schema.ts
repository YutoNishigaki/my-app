import {
  Field,
  GraphQLISODateTime,
  InputType,
  Int,
  ObjectType,
} from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  email!: string;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}

@InputType()
export class CreateUserInput {
  @Field(() => String)
  email!: string;

  @Field(() => String, { nullable: true })
  name?: string | null;
}

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  name?: string | null;
}
