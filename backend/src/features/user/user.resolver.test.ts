import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserResolver } from './user.resolver';
import { UsersService } from './user.service';

const createServiceMock = () => ({
  user: vi.fn(),
  users: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
});

describe('UserResolver', () => {
  let service: ReturnType<typeof createServiceMock>;
  let resolver: UserResolver;

  beforeEach(() => {
    service = createServiceMock();
    resolver = new UserResolver(service as unknown as UsersService);
  });

  it('getUser: should call service.user with id', async () => {
    const user = { id: 'user-1', email: 'a@example.com', role: 'USER' };
    service.user.mockResolvedValue(user);

    const result = await resolver.getUser('user-1');

    expect(service.user).toHaveBeenCalledWith({ id: 'user-1' });
    expect(result).toBe(user);
  });

  it('getUsers: should pass pagination args', async () => {
    const users = [{ id: 'user-1', email: 'a@example.com', role: 'USER' }];
    service.users.mockResolvedValue(users);

    const result = await resolver.getUsers(1, 5);

    expect(service.users).toHaveBeenCalledWith({ skip: 1, take: 5 });
    expect(result).toEqual(users);
  });

  it('createUser: should call service.createUser', async () => {
    const created = { id: 'user-1', email: 'b@example.com', role: 'USER' };
    service.createUser.mockResolvedValue(created);

    const result = await resolver.createUser({
      email: 'b@example.com',
      name: 'B',
    });

    expect(service.createUser).toHaveBeenCalledWith({
      email: 'b@example.com',
      name: 'B',
    });
    expect(result).toBe(created);
  });

  it('updateUser: should call service.updateUser with id and data', async () => {
    const updated = { id: 'user-1', email: 'c@example.com', role: 'USER' };
    service.updateUser.mockResolvedValue(updated);

    const result = await resolver.updateUser('user-1', { name: 'C' });

    expect(service.updateUser).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { name: 'C' },
    });
    expect(result).toBe(updated);
  });

  it('deleteUser: should call service.deleteUser', async () => {
    const deleted = { id: 'user-1', email: 'd@example.com', role: 'USER' };
    service.deleteUser.mockResolvedValue(deleted);

    const result = await resolver.deleteUser('user-1');

    expect(service.deleteUser).toHaveBeenCalledWith({ id: 'user-1' });
    expect(result).toBe(deleted);
  });
});
