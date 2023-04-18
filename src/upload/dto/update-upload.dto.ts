import { PartialType } from '@nestjs/swagger';
import { DownloadDto } from './download.dto';

export class UpdateUploadDto extends PartialType(DownloadDto) {}
