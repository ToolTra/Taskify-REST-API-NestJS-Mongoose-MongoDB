import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './user.schema';
import { UniqueUserFieldValidator } from './decorator/unique-field.decorator';
import { UserService } from './user.service';
import { TaskModule } from '../task/task.module';
import { UserController } from './user.controller';
import { LabelModule } from '../label/label.module';

const userMongooseModule = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);

@Module({
  imports: [userMongooseModule, TaskModule, LabelModule],
  providers: [UniqueUserFieldValidator, UserService],
  exports: [UniqueUserFieldValidator, userMongooseModule, UserService],
  controllers: [UserController],
})
export class UserModule {}
