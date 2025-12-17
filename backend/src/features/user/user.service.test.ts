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
    const user = {
      id: 'user-1',
      email: 'a@example.com',
      name: 'A',
      role: 'USER',
    };
    repository.findUnique.mockResolvedValue(user);

    const result = await service.user({ id: 'user-1' });

    expect(repository.findUnique).toHaveBeenCalledWith({ id: 'user-1' });
    expect(result).toBe(user);
  });

  it('users: should pass pagination params', async () => {
    const users = [
      { id: 'user-1', email: 'a@example.com', name: 'A', role: 'USER' },
    ];
    repository.findMany.mockResolvedValue(users);

    const result = await service.users({ skip: 1, take: 5 });

    expect(repository.findMany).toHaveBeenCalledWith({ skip: 1, take: 5 });
    expect(result).toEqual(users);
  });

  it('createUser: should forward create input', async () => {
    const created = {
      id: 'user-1',
      email: 'b@example.com',
      name: 'B',
      role: 'USER',
    };
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
    const updated = {
      id: 'user-1',
      email: 'c@example.com',
      name: 'C',
      role: 'USER',
    };
    repository.update.mockResolvedValue(updated);

    const result = await service.updateUser({
      where: { id: 'user-1' },
      data: { name: 'C' },
    });

    expect(repository.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { name: 'C' },
    });
    expect(result).toBe(updated);
  });

  it('deleteUser: should forward delete input', async () => {
    const deleted = {
      id: 'user-1',
      email: 'd@example.com',
      name: 'D',
      role: 'USER',
    };
    repository.delete.mockResolvedValue(deleted);

    const result = await service.deleteUser({ id: 'user-1' });

    expect(repository.delete).toHaveBeenCalledWith({ id: 'user-1' });
    expect(result).toBe(deleted);
  });
});
