import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class CreateUserDto {
  @ApiProperty({
    description: '用户名',
  })
  name: string;

  @ApiProperty({
    description: '密码',
  })
  password: string;

  @ApiProperty({
    description: '年龄',
  })
  age: number;
}
