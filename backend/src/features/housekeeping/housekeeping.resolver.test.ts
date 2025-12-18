import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HousekeepingResolver } from './housekeeping.resolver';
import { HousekeepingService } from './housekeeping.service';
import { CycleType, TaskStatus } from './housekeeping.schema';

const createHousekeepingServiceMock = () => ({
  listRooms: vi.fn(),
  createRoom: vi.fn(),
  updateRoom: vi.fn(),
  archiveRoom: vi.fn(),
  restoreRoom: vi.fn(),
  listCleaningTasks: vi.fn(),
  createCleaningTask: vi.fn(),
  recordTaskProgress: vi.fn(),
  updateCleaningTask: vi.fn(),
});

describe('HousekeepingResolver', () => {
  let resolver: HousekeepingResolver;
  let service: ReturnType<typeof createHousekeepingServiceMock>;

  beforeEach(async () => {
    service = createHousekeepingServiceMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HousekeepingResolver,
        { provide: HousekeepingService, useValue: service },
      ],
    }).compile();

    resolver = module.get<HousekeepingResolver>(HousekeepingResolver);
  });

  it('delegates room queries to service', async () => {
    service.listRooms.mockResolvedValue([{ id: 'room-1' }]);

    const result = await resolver.rooms('user-1', false, undefined);

    expect(service.listRooms).toHaveBeenCalledWith({
      userId: 'user-1',
      includeArchived: false,
      sortBy: undefined,
    });
    expect(result).toEqual([{ id: 'room-1' }]);
  });

  it('creates cleaning task via service', async () => {
    const task = { id: 'task-1', title: '掃除' };
    service.createCleaningTask.mockResolvedValue(task);

    const result = await resolver.createCleaningTask({
      roomId: 'room-1',
      userId: 'user-1',
      title: '掃除',
      cycleType: CycleType.DAILY,
    });

    expect(service.createCleaningTask).toHaveBeenCalledWith({
      roomId: 'room-1',
      userId: 'user-1',
      title: '掃除',
      cycleType: CycleType.DAILY,
    });
    expect(result).toBe(task);
  });

  it('records task progress through service', async () => {
    const task = { id: 'task-1' };
    service.recordTaskProgress.mockResolvedValue(task);

    const result = await resolver.completeCleaningTask({
      taskId: 'task-1',
      userId: 'user-1',
      status: TaskStatus.DONE,
    });

    expect(service.recordTaskProgress).toHaveBeenCalledWith({
      taskId: 'task-1',
      userId: 'user-1',
      status: TaskStatus.DONE,
    });
    expect(result).toBe(task);
  });
});
