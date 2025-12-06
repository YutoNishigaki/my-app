import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TodoService } from './todo.service';
import { Todo } from './todo.model';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Resolver(() => Todo)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Query(() => [Todo])
  todos() {
    return this.todoService.findAll();
  }

  @Query(() => Todo)
  todo(@Args('id', { type: () => Int }) id: number) {
    return this.todoService.findOne(id);
  }

  @Mutation(() => Todo)
  createTodo(@Args('data') data: CreateTodoDto) {
    return this.todoService.create(data);
  }

  @Mutation(() => Todo)
  updateTodo(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateTodoDto,
  ) {
    return this.todoService.update(id, data);
  }

  @Mutation(() => Todo)
  removeTodo(@Args('id', { type: () => Int }) id: number) {
    return this.todoService.remove(id);
  }
}
