import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from './audit-log.service';
import {
  BaseEntity,
  PaginationOptions,
  PaginatedResult,
} from '../interfaces/base.interface';

@Injectable()
export abstract class BaseService<T extends BaseEntity, CreateDto, UpdateDto> {
  protected abstract entityName: string;
  protected abstract prismaDelegate: any;

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly auditLogService: AuditLogService,
  ) {}

  async create(data: CreateDto, userId?: number): Promise<T> {
    try {
      const entity = await this.prismaDelegate.create({ data });

      await this.auditLogService.logAction(
        'CREATE',
        this.entityName,
        entity.id,
        `${this.entityName} created successfully`,
        userId,
      );

      return entity;
    } catch (error) {
      this.handlePrismaError(error, 'create');
    }
  }

  async findAll(
    filters: Record<string, any> = {},
    pagination?: PaginationOptions,
  ): Promise<PaginatedResult<T> | T[]> {
    const where = this.buildWhereClause(filters);

    if (pagination) {
      const {
        page = 1,
        limit = 10,
        sortBy = 'id',
        sortOrder = 'asc',
      } = pagination;
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.prismaDelegate.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: this.getIncludeOptions(),
        }),
        this.prismaDelegate.count({ where }),
      ]);

      await this.auditLogService.logAction(
        'FETCH_ALL',
        this.entityName,
        0,
        `Fetched ${data.length} ${this.entityName.toLowerCase()}s`,
      );

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    const data = await this.prismaDelegate.findMany({
      where,
      include: this.getIncludeOptions(),
    });

    await this.auditLogService.logAction(
      'FETCH_ALL',
      this.entityName,
      0,
      `Fetched all ${this.entityName.toLowerCase()}s`,
    );

    return data;
  }

  async findById(id: number, userId?: number): Promise<T> {
    const entity = await this.prismaDelegate.findUnique({
      where: { id },
      include: this.getIncludeOptions(),
    });

    if (!entity) {
      throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
    }

    await this.auditLogService.logAction(
      'FETCH',
      this.entityName,
      id,
      `Fetched ${this.entityName.toLowerCase()} with ID: ${id}`,
      userId,
    );

    return entity;
  }

  async update(
    id: number,
    data: Partial<UpdateDto>,
    userId?: number,
  ): Promise<T> {
    try {
      const entity = await this.prismaDelegate.update({
        where: { id },
        data,
        include: this.getIncludeOptions(),
      });

      await this.auditLogService.logAction(
        'UPDATE',
        this.entityName,
        id,
        `${this.entityName} with ID: ${id} updated successfully`,
        userId,
      );

      return entity;
    } catch (error) {
      this.handlePrismaError(error, 'update', id);
    }
  }

  async delete(id: number, userId?: number): Promise<T> {
    try {
      const entity = await this.prismaDelegate.delete({
        where: { id },
      });

      await this.auditLogService.logAction(
        'DELETE',
        this.entityName,
        id,
        `${this.entityName} with ID: ${id} deleted successfully`,
        userId,
      );

      return entity;
    } catch (error) {
      this.handlePrismaError(error, 'delete', id);
    }
  }

  protected buildWhereClause(
    filters: Record<string, any>,
  ): Record<string, any> {
    const where: Record<string, any> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (typeof value === 'string') {
          where[key] = { contains: value, mode: 'insensitive' };
        } else {
          where[key] = value;
        }
      }
    });

    return where;
  }

  protected getIncludeOptions(): Record<string, any> | undefined {
    return undefined;
  }

  protected handlePrismaError(
    error: any,
    operation: string,
    id?: number,
  ): never {
    if (error.code === 'P2002') {
      throw new ConflictException(
        `${this.entityName} already exists with this unique constraint`,
      );
    }

    if (error.code === 'P2025') {
      throw new NotFoundException(
        `${this.entityName} ${id ? `with ID ${id}` : ''} not found for ${operation} operation`,
      );
    }

    throw new BadRequestException(
      `Failed to ${operation} ${this.entityName.toLowerCase()}${id ? ` with ID ${id}` : ''}`,
    );
  }
}
