import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Res,
  Body,
  Query,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { zip } from 'compressing';
import type { Response } from 'express';
import { join } from 'path';
import { DownloadDto } from './dto/download.dto';

@ApiTags('上传文件')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('album')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '上传文件' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          description: '文件',
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  upload(@UploadedFile() file) {
    console.log(file);
    return true;
  }

  @Get('export')
  @ApiQuery({
    name: 'url',
    description: '文件地址',
  })
  @ApiQuery({
    name: 'name',
    description: '文件名字',
    required: false,
  })
  @ApiOperation({ summary: '文件下载' })
  downLoad(
    @Res() res: Response,
    @Query('url') url: string,
    @Query('name') name: string,
  ) {
    const _url = join(__dirname, `../images/${url}`);
    res.download(_url);
  }

  @Get('stream')
  @ApiQuery({
    name: 'url',
    description: '文件地址',
  })
  @ApiQuery({
    name: 'name',
    description: '文件名字',
    required: false,
  })
  @ApiOperation({ summary: '文件流下载' })
  async down(
    @Res() res: Response,
    @Query('url') url: string,
    @Query('name') name: string,
  ) {
    const _url = join(__dirname, `../images/${url}`);
    const tarStream = new zip.Stream();
    await tarStream.addEntry(_url);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${name || url}`);
    tarStream.pipe(res);
  }
}
