import { describe, expect, it, beforeEach, vi } from 'vitest';
import { UsersService } from './user.service';
import { UserRepository } from './user.repository';

const createRepositoryMock = () => ({
  findUnique: vi.fn(),
  findMany: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
});

describe('UsersService', () => {
  let repository: ReturnType<typeof createRepositoryMock>;
  let service: UsersService;

  beforeEach(() => {
    repository = createRepositoryMock();
    service = new UsersService(repository as unknown as UserRepository);
  });

  it('user: should delegate to repository', async () => {
    const user = { id: 1, email: 'a@example.com', name: 'A' };
    repository.findUnique.mockResolvedValue(user);

    const result = await service.user({ id: 1 });

    expect(repository.findUnique).toHaveBeenCalledWith({ id: 1 });
    expect(result).toBe(user);
  });

  it('users: should pass pagination params', async () => {
    const users = [{ id: 1, email: 'a@example.com', name: 'A' }];
    repository.findMany.mockResolvedValue(users);

    const result = await service.users({ skip: 1, take: 5 });

    expect(repository.findMany).toHaveBeenCalledWith({ skip: 1, take: 5 });
    expect(result).toEqual(users);
  });

  it('createUser: should forward create input', async () => {
    const created = { id: 1, email: 'b@example.com', name: 'B' };
    repository.create.mockResolvedValue(created);

    const result = await service.createUser({
      email: 'b@example.com',
      name: 'B',
    });

    expect(repository.create).toHaveBeenCalledWith({
      email: 'b@example.com',
      name: 'B',
    });
    expect(result).toBe(created);
  });

  it('updateUser: should forward update input', async () => {
    const updated = { id: 1, email: 'c@example.com', name: 'C' };
    repository.update.mockResolvedValue(updated);

    const result = await service.updateUser({
      where: { id: 1 },
      data: { name: 'C' },
    });

    expect(repository.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { name: 'C' },
    });
    expect(result).toBe(updated);
  });

  it('deleteUser: should forward delete input', async () => {
    const deleted = { id: 1, email: 'd@example.com', name: 'D' };
    repository.delete.mockResolvedValue(deleted);

    const result = await service.deleteUser({ id: 1 });

    expect(repository.delete).toHaveBeenCalledWith({ id: 1 });
    expect(result).toBe(deleted);
  });
});
