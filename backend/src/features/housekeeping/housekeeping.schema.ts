import {
  Field,
  GraphQLISODateTime,
  ID,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

export enum CycleType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  CUSTOM = 'CUSTOM',
}

registerEnumType(CycleType, {
  name: 'CycleType',
  description: 'タスクの周期種別',
});

export enum TaskStatus {
  DONE = 'DONE',
  SKIPPED = 'SKIPPED',
  DELAYED = 'DELAYED',
}

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'タスク履歴のステータス',
});

export enum RoomSort {
  NAME = 'NAME',
  LAST_ACTIVITY = 'LAST_ACTIVITY',
}

registerEnumType(RoomSort, {
  name: 'RoomSort',
  description: '部屋一覧のソート条件',
});

@ObjectType()
export class Room {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  userId!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  icon?: string | null;

  @Field(() => String, { nullable: true })
  color?: string | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  archivedAt?: Date | null;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}

@ObjectType()
export class CleaningTask {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  roomId!: string;

  @Field(() => String)
  userId!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => CycleType)
  cycleType!: CycleType;

  @Field(() => Int, { nullable: true })
  customIntervalDays?: number | null;

  @Field(() => Int, { nullable: true })
  priority?: number | null;

  @Field(() => Int, { nullable: true })
  estimatedMinutes?: number | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  nextScheduledAt?: Date | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  lastCompletedAt?: Date | null;

  @Field(() => Int)
  skipCount!: number;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}

@ObjectType()
export class TaskHistory {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  taskId!: string;

  @Field(() => String)
  userId!: string;

  @Field(() => TaskStatus)
  status!: TaskStatus;

  @Field(() => String, { nullable: true })
  memo?: string | null;

  @Field(() => String, { nullable: true })
  attachmentUrl?: string | null;

  @Field(() => GraphQLISODateTime)
  completedAt!: Date;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
}

@InputType()
export class CreateRoomInput {
  @Field(() => String)
  userId!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  icon?: string | null;

  @Field(() => String, { nullable: true })
  color?: string | null;
}

@InputType()
export class UpdateRoomInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  icon?: string | null;

  @Field(() => String, { nullable: true })
  color?: string | null;
}

@InputType()
export class CreateCleaningTaskInput {
  @Field(() => String)
  roomId!: string;

  @Field(() => String)
  userId!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => CycleType)
  cycleType!: CycleType;

  @Field(() => Int, { nullable: true })
  customIntervalDays?: number | null;

  @Field(() => Int, { nullable: true })
  priority?: number | null;

  @Field(() => Int, { nullable: true })
  estimatedMinutes?: number | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  nextScheduledAt?: Date | null;
}

@InputType()
export class UpdateCleaningTaskInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => CycleType, { nullable: true })
  cycleType?: CycleType;

  @Field(() => Int, { nullable: true })
  customIntervalDays?: number | null;

  @Field(() => Int, { nullable: true })
  priority?: number | null;

  @Field(() => Int, { nullable: true })
  estimatedMinutes?: number | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  nextScheduledAt?: Date | null;
}

@InputType()
export class CompleteTaskInput {
  @Field(() => String)
  taskId!: string;

  @Field(() => String)
  userId!: string;

  @Field(() => TaskStatus)
  status!: TaskStatus;

  @Field(() => String, { nullable: true })
  memo?: string | null;

  @Field(() => String, { nullable: true })
  attachmentUrl?: string | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  completedAt?: Date | null;
}
