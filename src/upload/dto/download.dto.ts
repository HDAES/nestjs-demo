import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class DownloadDto {
  @ApiProperty({
    description: '文件地址',
    required: false,
  })
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: '文件名字',
    required: false,
  })
  name: string;
}
