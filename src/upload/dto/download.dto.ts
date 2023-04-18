import { ApiProperty } from '@nestjs/swagger';

export class DownloadDto {
  @ApiProperty({
    description: '文件地址',
    required: true,
  })
  url: string;

  @ApiProperty({
    description: '文件名字',
    required: false,
  })
  name: string;
}
