import {
  Controller,
  Post,
  Body,
  BadRequestException,
  HttpException,
  HttpStatus,
  Res,
  Get,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign_up.dto';
import { SignInDto } from './dto/sign_in.dto';
import { formatValidationErrors } from 'src/lib/formatValidationErrors';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('validateSignUp')
  async validateSignUp(@Body() signUpDto: SignUpDto) {
    return await this.validate(signUpDto);
  }

  @Post('signUp')
  async signUp(@Body() signUpDto: SignUpDto) {
    const validationErrors = await this.validate(signUpDto);
    if (!!Object.keys(validationErrors['errors']).length) {
      throw new BadRequestException();
    }

    try {
      await this.authService.signUp(signUpDto);
      return { result: true };
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('signIn')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInDto,
  ) {
    const { user, errors } = await this.authService.validateSignIn(signInDto);
    if (!user || !!errors.length) {
      response.send({ errors });
      return;
    }

    const token = await this.authService.signIn(user);
    response.cookie('token', token).send({ errors });
  }

  @Get('checkSignedIn')
  async checkSignedIn(@Req() request: Request) {
    try {
      await this.authService.verify(request.cookies['token']);
      return true;
    } catch (e) {
      // NOTE: トークンエラーの場合は要認証とみなしfalseを返す
      if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError) {
        return false;
      }
      throw new InternalServerErrorException(e);
    }
  }

  private async validate(signUpDto: SignUpDto) {
    const validationErrors = await this.authService.validateSignUp(signUpDto);
    const result: { [key: string]: { [key: string]: string[] } } = {};
    result['errors'] =
      validationErrors.length > 0
        ? formatValidationErrors(validationErrors)
        : {};
    return result;
  }
}
