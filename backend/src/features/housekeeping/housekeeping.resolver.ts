import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { HousekeepingService } from './housekeeping.service';
import {
  CleaningTask,
  CompleteTaskInput,
  CreateCleaningTaskInput,
  CreateRoomInput,
  Room,
  RoomSort,
  UpdateCleaningTaskInput,
  UpdateRoomInput,
} from './housekeeping.schema';

@Resolver()
export class HousekeepingResolver {
  constructor(private readonly housekeepingService: HousekeepingService) {}

  @Query(() => [Room], { description: 'ユーザーの部屋一覧を取得する' })
  rooms(
    @Args('userId', { type: () => String }) userId: string,
    @Args('includeArchived', { type: () => Boolean, nullable: true })
    includeArchived?: boolean,
    @Args('sortBy', { type: () => RoomSort, nullable: true }) sortBy?: RoomSort,
  ) {
    return this.housekeepingService.listRooms({
      userId,
      includeArchived,
      sortBy,
    });
  }

  @Mutation(() => Room, { description: '部屋を新規作成する' })
  createRoom(@Args('data') data: CreateRoomInput) {
    return this.housekeepingService.createRoom(data);
  }

  @Mutation(() => Room, { description: '部屋の表示設定や名称を更新する' })
  updateRoom(
    @Args('roomId') roomId: string,
    @Args('data') data: UpdateRoomInput,
  ) {
    return this.housekeepingService.updateRoom(roomId, data);
  }

  @Mutation(() => Room, { description: '部屋をアーカイブする' })
  archiveRoom(@Args('roomId') roomId: string) {
    return this.housekeepingService.archiveRoom(roomId);
  }

  @Mutation(() => Room, { description: 'アーカイブ済みの部屋を復元する' })
  restoreRoom(@Args('roomId') roomId: string) {
    return this.housekeepingService.restoreRoom(roomId);
  }

  @Query(() => [CleaningTask], {
    description: '部屋に紐づく掃除タスクを取得する',
  })
  cleaningTasks(@Args('roomId') roomId: string) {
    return this.housekeepingService.listCleaningTasks(roomId);
  }

  @Mutation(() => CleaningTask, { description: '掃除タスクを新規作成する' })
  createCleaningTask(@Args('data') data: CreateCleaningTaskInput) {
    return this.housekeepingService.createCleaningTask(data);
  }

  @Mutation(() => CleaningTask, {
    description: 'タスクの進捗を履歴に記録し、次回予定を更新する',
  })
  completeCleaningTask(@Args('input') input: CompleteTaskInput) {
    return this.housekeepingService.recordTaskProgress(input);
  }

  @Mutation(() => CleaningTask, { description: 'タスクの設定を更新する' })
  updateCleaningTask(
    @Args('taskId') taskId: string,
    @Args('data') data: UpdateCleaningTaskInput,
  ) {
    return this.housekeepingService.updateCleaningTask(taskId, data);
  }
}
