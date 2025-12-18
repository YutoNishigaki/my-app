import type { CleaningTask, Room } from '@/generated/prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CleaningTaskRepository,
  RoomRepository,
  TaskHistoryRepository,
} from './housekeeping.repository';
import {
  HousekeepingService,
  calculateNextScheduledAt,
} from './housekeeping.service';
import { CycleType, RoomSort, TaskStatus } from './housekeeping.schema';

const createRoomRepositoryMock = () => ({
  create: vi.fn(),
  update: vi.fn(),
  findMany: vi.fn(),
});

const createTaskRepositoryMock = () => ({
  create: vi.fn(),
  update: vi.fn(),
  findMany: vi.fn(),
  findUnique: vi.fn(),
});

const createHistoryRepositoryMock = () => ({
  create: vi.fn(),
});

const createRoom = (overrides: Partial<Room> = {}): Room => ({
  id: 'room-1',
  userId: 'user-1',
  name: 'リビング',
  icon: null,
  color: null,
  archivedAt: null,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  ...overrides,
});

const createCleaningTask = (
  overrides: Partial<CleaningTask> = {},
): CleaningTask => ({
  id: 'task-1',
  roomId: 'room-1',
  userId: 'user-1',
  title: '掃除',
  description: null,
  cycleType: CycleType.DAILY,
  customIntervalDays: null,
  priority: null,
  estimatedMinutes: null,
  nextScheduledAt: new Date('2024-01-02T00:00:00Z'),
  lastCompletedAt: null,
  skipCount: 0,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  ...overrides,
});

describe('calculateNextScheduledAt', () => {
  it('adds proper days for each cycle type', () => {
    const base = new Date('2024-01-01T00:00:00Z');

    expect(calculateNextScheduledAt(base, CycleType.DAILY)).toEqual(
      new Date('2024-01-02T00:00:00.000Z'),
    );
    expect(calculateNextScheduledAt(base, CycleType.WEEKLY)).toEqual(
      new Date('2024-01-08T00:00:00.000Z'),
    );
    expect(calculateNextScheduledAt(base, CycleType.MONTHLY)).toEqual(
      new Date('2024-02-01T00:00:00.000Z'),
    );
    expect(calculateNextScheduledAt(base, CycleType.CUSTOM, 10)).toEqual(
      new Date('2024-01-11T00:00:00.000Z'),
    );
  });

  it('throws when custom interval is missing', () => {
    expect(() =>
      calculateNextScheduledAt(new Date(), CycleType.CUSTOM),
    ).toThrow();
  });
});

describe('HousekeepingService', () => {
  let roomRepository: ReturnType<typeof createRoomRepositoryMock>;
  let taskRepository: ReturnType<typeof createTaskRepositoryMock>;
  let historyRepository: ReturnType<typeof createHistoryRepositoryMock>;
  let service: HousekeepingService;

  beforeEach(() => {
    roomRepository = createRoomRepositoryMock();
    taskRepository = createTaskRepositoryMock();
    historyRepository = createHistoryRepositoryMock();
    service = new HousekeepingService(
      roomRepository as unknown as RoomRepository,
      taskRepository as unknown as CleaningTaskRepository,
      historyRepository as unknown as TaskHistoryRepository,
    );
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
  });

  it('creates room by delegating to repository', async () => {
    const room = createRoom();
    roomRepository.create.mockResolvedValue(room);

    const result = await service.createRoom({
      userId: 'user-1',
      name: 'リビング',
    });

    expect(roomRepository.create).toHaveBeenCalledWith({
      user: { connect: { id: 'user-1' } },
      name: 'リビング',
      icon: undefined,
      color: undefined,
    });
    expect(result).toBe(room);
  });

  it('filters rooms by archived flag when listing', async () => {
    roomRepository.findMany.mockResolvedValue([]);

    await service.listRooms({ userId: 'user-1' });
    expect(roomRepository.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1', archivedAt: null },
      orderBy: { name: 'asc' },
    });

    await service.listRooms({
      userId: 'user-1',
      includeArchived: true,
      sortBy: RoomSort.LAST_ACTIVITY,
    });
    expect(roomRepository.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      orderBy: { updatedAt: 'desc' },
    });
  });

  it('rejects invalid custom interval on creation', async () => {
    await expect(
      service.createCleaningTask({
        roomId: 'room-1',
        userId: 'user-1',
        title: '掃除',
        cycleType: CycleType.CUSTOM,
      }),
    ).rejects.toThrow('カスタム周期は1〜365日の間で指定してください');
  });

  it('creates cleaning task with next schedule', async () => {
    const created = createCleaningTask();
    taskRepository.create.mockResolvedValue(created);

    const result = await service.createCleaningTask({
      roomId: 'room-1',
      userId: 'user-1',
      title: '掃除',
      cycleType: CycleType.DAILY,
    });

    expect(taskRepository.create).toHaveBeenCalledWith({
      room: { connect: { id: 'room-1' } },
      user: { connect: { id: 'user-1' } },
      title: '掃除',
      description: undefined,
      cycleType: CycleType.DAILY,
      customIntervalDays: null,
      priority: undefined,
      estimatedMinutes: undefined,
      nextScheduledAt: new Date('2024-01-02T00:00:00.000Z'),
    });
    expect(result).toBe(created);
  });

  it('updates next schedule and history when task is completed', async () => {
    const task = createCleaningTask({
      cycleType: CycleType.WEEKLY,
      customIntervalDays: null,
      nextScheduledAt: new Date('2024-01-08T00:00:00Z'),
    });
    taskRepository.findUnique.mockResolvedValue(task);
    taskRepository.update.mockResolvedValue({
      ...task,
      lastCompletedAt: new Date('2024-01-01T00:00:00Z'),
    });

    const result = await service.recordTaskProgress({
      taskId: 'task-1',
      userId: 'user-1',
      status: TaskStatus.DONE,
      memo: '完了',
    });

    expect(taskRepository.update).toHaveBeenCalledWith({
      where: { id: 'task-1' },
      data: {
        lastCompletedAt: new Date('2024-01-01T00:00:00Z'),
        skipCount: 0,
        nextScheduledAt: new Date('2024-01-08T00:00:00.000Z'),
      },
    });
    expect(historyRepository.create).toHaveBeenCalledWith({
      task: { connect: { id: 'task-1' } },
      user: { connect: { id: 'user-1' } },
      status: TaskStatus.DONE,
      memo: '完了',
      attachmentUrl: undefined,
      completedAt: new Date('2024-01-01T00:00:00Z'),
    });
    expect(result).toEqual({
      ...task,
      lastCompletedAt: new Date('2024-01-01T00:00:00Z'),
    });
  });

  it('increments skip count when task is skipped', async () => {
    const task = createCleaningTask({
      cycleType: CycleType.DAILY,
      skipCount: 1,
      nextScheduledAt: new Date('2024-01-02T00:00:00Z'),
    });

    taskRepository.findUnique.mockResolvedValue(task);
    taskRepository.update.mockResolvedValue({
      ...task,
      skipCount: 2,
      nextScheduledAt: new Date('2024-01-03T00:00:00Z'),
    });

    await service.recordTaskProgress({
      taskId: 'task-1',
      userId: 'user-1',
      status: TaskStatus.SKIPPED,
    });

    expect(taskRepository.update).toHaveBeenCalledWith({
      where: { id: 'task-1' },
      data: {
        lastCompletedAt: null,
        skipCount: 2,
        nextScheduledAt: new Date('2024-01-03T00:00:00.000Z'),
      },
    });
    expect(historyRepository.create).toHaveBeenCalledWith({
      task: { connect: { id: 'task-1' } },
      user: { connect: { id: 'user-1' } },
      status: TaskStatus.SKIPPED,
      memo: undefined,
      attachmentUrl: undefined,
      completedAt: new Date('2024-01-01T00:00:00Z'),
    });
  });
});
