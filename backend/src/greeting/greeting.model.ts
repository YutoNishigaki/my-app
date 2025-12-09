import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Greeting {
  @Field()
  message!: string;
}
