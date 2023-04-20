import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * 登录
   * @param req
   * @param body
   */
  async login(body: LoginUserDto, req): Promise<User> {
    const res = await this.user.find({
      where: {
        account: body.account,
        password: body.password,
      },
    });
    if (res.length === 0) {
      throw new HttpException('账号或者密码错误', HttpStatus.CREATED);
    } else {
      const user = res[0];
      await this.user.update(user.id, { last_login_ip: req.ip });

      user.access_token = await this.jwtService.signAsync({ id: user.id });
      return user;
    }
  }
  create(createUserDto: CreateUserDto, req) {
    const data = new User();
    data.account = createUserDto.account;
    data.password = createUserDto.password;
    data.roles = createUserDto.roles;
    data.name = createUserDto.name;
    data.last_login_ip = req.ip;
    return this.user.save(data);
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return this.user.findOneById(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return this.user.delete(id);
  }
}
