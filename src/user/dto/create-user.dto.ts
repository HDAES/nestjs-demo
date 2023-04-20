import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class CreateUserDto {
  @ApiProperty({
    description: '用户名',
  })
  name: string;

  @ApiProperty({
    description: '账号 ',
  })
  account: string;

  @ApiProperty({
    description: '密码 ',
  })
  password: string;

  @ApiProperty({
    description: '用户角色 ',
  })
  roles: string[];
}
