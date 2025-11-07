import { Module } from '@nestjs/common';
import { TreeService } from './tree.service';
import { TreeController } from './tree.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreeNode } from './tree-node.entity';
import { TreeResolver } from './tree.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([TreeNode])],
  controllers: [TreeController],
  providers: [TreeService, TreeResolver],
})
export class TreeModule {}
