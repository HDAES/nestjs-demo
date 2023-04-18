import { Controller, Get } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { Public, ReqDec } from 'src/common/decorator/public.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('用户相关')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Get()
  @Public()
  async find() {
    return {
      access_token: await this.jwtService.signAsync({ name: 123 }),
    };
  }

  @Get('login')
  @ApiBearerAuth()
  async login(@ReqDec() res) {
    return res.user;
  }
}
