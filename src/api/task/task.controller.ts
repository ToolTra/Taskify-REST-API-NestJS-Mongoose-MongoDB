import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { TaskService } from './task.service';
import { AccessTokenGuard, PolicyGuard } from '../auth/guards';
import { CreateTaskDTO, UpdateTaskDTO } from './dto';
import { TaskPolicy } from './task.policy';
import { UserDocument } from '../user/user.schema';
import { UserAction } from '../auth/auth.policy';
import { AuthUser, CheckPolicy } from '../auth/decorator';
import { TaskDocument } from './task.schema';
import { BindTaskParamPipe } from './pipe';

@Controller('api/tasks')
export class TaskController {
  constructor(
    private taskService: TaskService,
    private taskPolicy: TaskPolicy,
  ) {}

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  async getOne(
    @Param('id', BindTaskParamPipe) task: TaskDocument,
    @AuthUser() authUser: UserDocument,
  ) {
    this.taskPolicy.authorize(authUser, UserAction.Read, task);
    return task;
  }

  @Post('')
  @UseGuards(AccessTokenGuard)
  @UseGuards(PolicyGuard)
  @CheckPolicy(TaskPolicy, UserAction.Create)
  async create(
    @Body() payload: CreateTaskDTO,
    @AuthUser() authUser: UserDocument,
  ) {
    return this.taskService.create(payload, authUser.id);
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard)
  async update(
    @Param('id', BindTaskParamPipe) task: TaskDocument,
    @Body() payload: UpdateTaskDTO,
    @AuthUser() authUser: UserDocument,
  ) {
    this.taskPolicy.authorize(authUser, UserAction.Update, task);
    return this.taskService.update(task, payload);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async delete(
    @Param('id', BindTaskParamPipe) task: TaskDocument,
    @AuthUser() authUser: UserDocument,
  ) {
    this.taskPolicy.authorize(authUser, UserAction.Delete, task);
    return this.taskService.delete(task);
  }
}
