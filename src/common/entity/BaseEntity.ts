import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeUpdate,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import dayjs from 'dayjs';
import { Transform } from 'class-transformer';
export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '创建时间',
  })
  @CreateDateColumn()
  create_date: string;

  @ApiProperty({
    description: '更新时间',
  })
  @UpdateDateColumn()
  update_date: string;
}
