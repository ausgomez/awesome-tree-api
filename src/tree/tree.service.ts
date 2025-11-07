import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TreeNode } from './tree-node.entity';
import { Repository, IsNull } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNodeDto } from './dto/create-node.dto';
import { TreeNodeResponseDto } from './dto/tree-response.dto';

@Injectable()
export class TreeService {
  constructor(
    @InjectRepository(TreeNode)
    private readonly treeNodeRepository: Repository<TreeNode>,
  ) {}

  /**
   * Returns all trees, which are all root nodes with their children
   * @returns Array of tree
   */
  async findAllTrees() {
    try {
      // This finds all the nodes that dont have any parentId, which are considered root nodes
      const rootNodes: TreeNode[] = await this.treeNodeRepository.find({
        where: {
          parentId: IsNull(),
        },
        relations: ['children'],
      });

      return await Promise.all(
        rootNodes.map((root) => this.buildTreeStructure(root)),
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve trees', error);
    }
  }

  /**
   * Fills the children nodes of the node passed
   * @param node
   * @private
   * @returns TreeNode
   */
  private async buildTreeStructure(
    node: TreeNode,
  ): Promise<TreeNodeResponseDto> {
    const nodeWithChildren = await this.treeNodeRepository.findOne({
      where: { id: node.id },
      relations: ['children'], // this ensures that top-level child nodes are included
    });

    if (!nodeWithChildren) {
      throw new NotFoundException(`Node with ID ${node.id} not found`);
    }

    // Re-using this same function to fill the children nodes
    const children = await Promise.all(
      (nodeWithChildren.children || []).map((child) =>
        this.buildTreeStructure(child),
      ),
    );

    return {
      id: nodeWithChildren.id,
      label: nodeWithChildren.label,
      children,
    };
  }

  /**
   * This creates a new node and saves it to the database
   * @param createNodeDto
   * @returns treeNodeResponseDto
   */
  async createNode(createNodeDto: CreateNodeDto): Promise<TreeNodeResponseDto> {
    const { label, parentId } = createNodeDto;

    try {
      if (parentId) {
        const doesParentExists = await this.treeNodeRepository.findOne({
          where: {
            id: parentId,
          },
        });

        if (!doesParentExists) {
          throw new NotFoundException(
            `Parent node with ID ${parentId} not found`,
          );
        }
      }

      const newNode = this.treeNodeRepository.create({
        label,
        parentId: parentId ?? undefined,
      });

      const savedNode = await this.treeNodeRepository.save(newNode);

      return {
        id: savedNode.id,
        label: savedNode.label,
        children: [],
      } as TreeNodeResponseDto;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create node', error);
    }
  }
}
