import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '用户名',
  })
  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  age: number;
}
