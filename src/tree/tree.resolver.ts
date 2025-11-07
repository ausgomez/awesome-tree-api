import { Injectable } from '@nestjs/common';
import { Tool, type Context } from '@rekog/mcp-nest';
import { z } from 'zod';
import { TreeService } from './tree.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { TreeNode } from './tree-node.entity';

@Injectable()
export class TreeResolver {
  constructor(private readonly treeService: TreeService) {}

  @Tool({
    name: 'find-all-trees',
    description: 'Finds all trees',
  })
  async findAllTrees() {
    const rootNodes = await this.treeService.findAllTrees();
    let childrenNodesCount = 0;

    rootNodes.forEach((node: TreeNode) => {
      childrenNodesCount += node.children.length;
    });

    return `There are in total ${rootNodes.length} root nodes, and all of them have ${childrenNodesCount} children nodes`;
  }

  @Tool({
    name: 'create-new-node',
    description: 'Create a new node',
    parameters: z.object({
      label: z.string(),
      parentId: z.number().optional(),
    }),
  })
  async createNewNode({ label, parentId }: CreateNodeDto, ctx: Context) {
    const createdNode = await this.treeService.createNode({
      label,
      parentId,
    } as CreateNodeDto);

    return `Created ${createdNode.label} with id ${createdNode.id}`;
  }

  @Tool({
    name: 'find-node-by-id',
    description: 'Find a node by id',
    parameters: z.object({
      id: z.number(),
    }),
  })
  async findNodeById({ id }: { id: number }, ctx: Context) {
    const foundNode = await this.treeService.findNodeById(id);

    return `Node with id ${foundNode.id} has label ${foundNode.label}, and it has ${foundNode.children.length} children.`;
  }

  @Tool({
    name: 'delete-node-by-id',
    description: 'Find a node by id',
    parameters: z.object({
      id: z.number(),
    }),
  })
  async deleteNode({ id }: { id: number }, ctx: Context) {
    const foundNode = await this.treeService.deleteNodeById(id);

    return `Node with id ${foundNode.id} and label ${foundNode.label} has been deleted along with their children.`;
  }
}
