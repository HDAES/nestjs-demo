import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entity/BaseEntity';
@Entity()
export class User extends BaseEntity {
  @ApiProperty({
    description: '用户名',
  })
  @Column({
    comment: '用户名',
  })
  name: string;

  @ApiProperty({
    description: '账号 ',
  })
  @Column({
    comment: '账号',
  })
  account: string;

  @Column({
    select: false,
    comment: '密码',
  })
  password: string;

  @ApiProperty({
    description: '用户角色 ',
  })
  @Column({
    type: 'simple-array',
    comment: '用户角色',
  })
  roles: string[];

  @ApiProperty({ description: '返回token' })
  access_token: string;

  @ApiProperty({ description: '最后登录ip' })
  @Column({
    comment: '最后登录ip',
  })
  last_login_ip: string;

  @ApiProperty({ description: '最后登录时间' })
  @Column({
    comment: '最后登录时间',
    type: 'datetime',
    default: () => 'NOW()',
  })
  last_login_date: string;
}
