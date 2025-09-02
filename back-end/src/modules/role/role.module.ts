import { Module } from '@nestjs/common';
import { RoleEntity } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [],
  controllers: [],
})
export class RoleModule {}
