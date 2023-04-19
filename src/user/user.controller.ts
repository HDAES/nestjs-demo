import {
  Controller,
  Get,
  Req,
  Res,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { Public, ReqDec } from 'src/common/decorator/public.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import * as svgCaptcha from 'svg-captcha';
import { LoginUserDto } from './dto/login-user.dto';
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

  @Get('code')
  @Public()
  @ApiOperation({ summary: '获取登录验证码' })
  createCaptcha(@Req() req, @Res() res) {
    const captcha = svgCaptcha.create({
      size: 4, //生成几个验证码
      fontSize: 50, //文字大小
      width: 100, //宽度
      height: 34, //高度
      background: '#cc9966',
    });
    req.session.code = captcha.text;
    console.log(captcha.text);
    res.type('image/svg+xml');
    res.send(captcha.data);
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: '获取登录验证码' })
  login(@Req() req, @Body() body: LoginUserDto) {
    if (req.session.code) {
      if (
        req.session.code.toLocaleLowerCase() === body?.code.toLocaleLowerCase()
      ) {
        return {
          message: '登录成功',
        };
      } else {
        throw new HttpException('验证码错误', HttpStatus.CREATED);
      }
    } else {
      throw new HttpException('请先获取验证码', HttpStatus.CREATED);
    }
  }
}
