import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign_up.dto';
import { PrismaService } from '../prisma.service';
import { validate } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign_in.dto';
import { User } from '@prisma/client';
import { JwtPayload } from '@/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  SIGN_IN_VALIDATION_ERRORS = [
    'メールアドレス、またはパスワードが異なります。',
  ];

  async validateSignUp(sighUpDto: SignUpDto) {
    // DTOにマッピング
    const dtoInstance = plainToInstance(SignUpDto, sighUpDto);
    return await validate(dtoInstance);
  }

  async signUp(sighUpDto: SignUpDto) {
    // パスワードをハッシュ化して保存する
    const hashed_password = await bcrypt.hash(sighUpDto.password, 10);
    return await this.prisma.user.create({
      data: {
        name: sighUpDto.name,
        email: sighUpDto.email,
        password: hashed_password,
      },
    });
  }

  async validateSignIn(signinDto: SignInDto) {
    const { email, password } = signinDto;
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) {
      return { user: null, errors: this.SIGN_IN_VALIDATION_ERRORS };
    }

    const comparedResult = await bcrypt.compare(password, user.password);
    if (!comparedResult) {
      return { user: null, errors: this.SIGN_IN_VALIDATION_ERRORS };
    }
    const errors: string[] = [];
    return { user, errors };
  }

  async signIn(user: User) {
    const payload: JwtPayload = { userId: String(user.id), email: user.email };
    return await this.jwtService.signAsync(payload);
  }

  async verify(token: string) {
    return await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
  }
}
