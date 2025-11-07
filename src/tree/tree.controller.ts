import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { TreeService } from './tree.service';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { TreeNodeResponseDto } from './dto/tree-response.dto';
import { CreateNodeDto } from './dto/create-node.dto';

@Controller('tree')
export class TreeController {
  constructor(private readonly treeService: TreeService) {}

  // ============================================
  // GET /api/tree - Get all trees from database
  // ============================================
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all trees',
    description:
      'Returns an array of all root nodes with their nested children',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all trees',
    type: [TreeNodeResponseDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getAllTrees(): Promise<any> {
    return this.treeService.findAllTrees();
  }

  // ============================================
  // POST /api/tree - Create a new tree node and save it in the databse
  // ============================================
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new tree node',
    description:
      'Creates a new node and attaches it to the specified parent. Omit parentId to create a root node.',
  })
  @ApiBody({ type: CreateNodeDto })
  @ApiResponse({
    status: 201,
    description: 'Node successfully created',
    type: TreeNodeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Parent node not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async createNode(
    @Body() createNodeDto: CreateNodeDto,
  ): Promise<TreeNodeResponseDto> {
    return this.treeService.createNode(createNodeDto);
  }

  // ============================================
  // DELETE /api/tree/:id - Create a new tree node by id
  // ============================================
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deletes a node by id',
    description:
      'Finds and deletes a node and all their children from the database by ID',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Node not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async deleteNodeById(@Param('id') id: number) {
    return this.treeService.deleteNodeById(id);
  }
}
