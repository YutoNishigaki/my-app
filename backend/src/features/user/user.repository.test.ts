/* eslint-disable @typescript-eslint/unbound-method */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserRepository } from './user.repository';
import { DatabaseClient } from '@/lib/database-client';

const createDatabaseClientMock = () => {
  const user = {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  return { user } as unknown as DatabaseClient;
};

describe('UserRepository', () => {
  let databaseClient: DatabaseClient;
  let repository: UserRepository;

  beforeEach(() => {
    databaseClient = createDatabaseClientMock();
    repository = new UserRepository(databaseClient);
  });

  it('findUnique: should forward where', async () => {
    const where = { id: 1 };
    const user = { id: 1, email: 'a@example.com' };
    (
      databaseClient.user.findUnique as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue(user);

    const result = await repository.findUnique(where);

    expect(databaseClient.user.findUnique).toHaveBeenCalledWith({ where });
    expect(result).toBe(user);
  });

  it('findMany: should forward params', async () => {
    const users = [{ id: 1, email: 'a@example.com' }];
    (
      databaseClient.user.findMany as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue(users);

    const result = await repository.findMany({ skip: 1, take: 2 });

    expect(databaseClient.user.findMany).toHaveBeenCalledWith({
      skip: 1,
      take: 2,
    });
    expect(result).toEqual(users);
  });

  it('create: should forward data', async () => {
    const created = { id: 1, email: 'b@example.com' };
    (
      databaseClient.user.create as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue(created);

    const result = await repository.create({ email: 'b@example.com' });

    expect(databaseClient.user.create).toHaveBeenCalledWith({
      data: { email: 'b@example.com' },
    });
    expect(result).toBe(created);
  });

  it('update: should forward where and data', async () => {
    const updated = { id: 1, email: 'c@example.com' };
    (
      databaseClient.user.update as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue(updated);

    const result = await repository.update({
      where: { id: 1 },
      data: { email: 'c@example.com' },
    });

    expect(databaseClient.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { email: 'c@example.com' },
    });
    expect(result).toBe(updated);
  });

  it('delete: should forward where', async () => {
    const deleted = { id: 1, email: 'd@example.com' };
    (
      databaseClient.user.delete as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue(deleted);

    const result = await repository.delete({ id: 1 });

    expect(databaseClient.user.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toBe(deleted);
  });
});
