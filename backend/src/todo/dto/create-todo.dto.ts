import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateTodoDto {
  @Field()
  @IsString()
  @MaxLength(200)
  title!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
