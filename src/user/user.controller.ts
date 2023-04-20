import {
  Controller,
  Get,
  Req,
  Res,
  Post,
  Body,
  Delete,
  Param,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { Public, ReqDec } from 'src/common/decorator/public.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import * as svgCaptcha from 'svg-captcha';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { isEmpty } from 'class-validator';
@ApiTags('用户相关')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

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
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ type: User })
  login(@Req() req, @Body() body: LoginUserDto) {
    if (req.session.code) {
      if (
        req.session.code.toLocaleLowerCase() === body?.code.toLocaleLowerCase()
      ) {
        return this.userService.login(body, req);
      } else {
        throw new HttpException('验证码错误', HttpStatus.CREATED);
      }
    } else {
      throw new HttpException('请先获取验证码', HttpStatus.CREATED);
    }
  }

  @Post()
  @ApiOperation({ summary: '添加用户' })
  @ApiResponse({ type: User })
  async addUser(@Req() req, @Body() body: CreateUserDto) {
    return this.userService.create(body, req);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  @ApiParam({ name: 'id', description: '用户id' })
  async deleteUser(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
