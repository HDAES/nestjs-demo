import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class LoginUserDto {
  @ApiProperty({
    description: '验证码',
  })
  @IsNotEmpty({ message: '验证码不能为空' })
  code: string;

  @ApiProperty({
    description: '账号',
  })
  @IsNotEmpty({ message: '账号不能为空' })
  account: string;

  @ApiProperty({
    description: '密码',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
