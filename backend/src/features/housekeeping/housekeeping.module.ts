import { Module } from '@nestjs/common';
import { HousekeepingResolver } from './housekeeping.resolver';
import { HousekeepingService } from './housekeeping.service';
import {
  CleaningTaskRepository,
  RoomRepository,
  TaskHistoryRepository,
} from './housekeeping.repository';

@Module({
  providers: [
    HousekeepingResolver,
    HousekeepingService,
    RoomRepository,
    CleaningTaskRepository,
    TaskHistoryRepository,
  ],
})
export class HousekeepingModule {}
