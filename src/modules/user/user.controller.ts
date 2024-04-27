import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { AtGuard } from '../auth/guards';
import { IAtJwt } from 'src/common/interfaces/auth';
import { UserMapper } from './mapper';
import { GetUserDto } from './dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @UseGuards(AtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sign up' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    type: GetUserDto,
  })
  @Get('info')
  public async getUser(
    @Req() request: Request & { user: IAtJwt },
  ): Promise<GetUserDto> {
    const userJwt = request.user;
    const user = await this.service.getUserByEmail(userJwt.email);
    return UserMapper.map(user);
  }
}
