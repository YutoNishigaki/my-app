import { NotFoundException } from '@nestjs/common';
import { TodoService } from './todo.service';
import { PrismaService } from '../prisma/prisma.service';

const createPrismaMock = () => ({
  todo: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

describe('TodoService', () => {
  let prisma: PrismaService;
  let service: TodoService;

  beforeEach(() => {
    prisma = createPrismaMock() as unknown as PrismaService;
    service = new TodoService(prisma);
  });

  it('should list todos ordered by creation date', async () => {
    await service.findAll();
    expect(prisma.todo.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should return a todo when it exists', async () => {
    const todo = { id: 1, title: 'Test', description: '', completed: false };
    (prisma.todo.findUnique as jest.Mock).mockResolvedValue(todo);

    const result = await service.findOne(1);

    expect(result).toBe(todo);
    expect(prisma.todo.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should throw when todo is not found', async () => {
    (prisma.todo.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should update after ensuring todo exists', async () => {
    const todo = { id: 2, title: 'Test', description: '', completed: false };
    (prisma.todo.findUnique as jest.Mock).mockResolvedValue(todo);

    await service.update(2, { title: 'Updated' });

    expect(prisma.todo.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: { title: 'Updated' },
    });
  });

  it('should delete after ensuring todo exists', async () => {
    const todo = { id: 3, title: 'Test', description: '', completed: false };
    (prisma.todo.findUnique as jest.Mock).mockResolvedValue(todo);

    await service.remove(3);

    expect(prisma.todo.delete).toHaveBeenCalledWith({ where: { id: 3 } });
  });
});
