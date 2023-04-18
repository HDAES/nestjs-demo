import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class DownloadDto {
  @ApiProperty({
    description: '文件地址',
    required: false,
  })
  @IsNotEmpty({
    message: '文件地址不能为空',
  })
  url: string;

  @ApiProperty({
    description: '文件名字',
    required: false,
  })
  @IsNotEmpty()
  name: string;
}
