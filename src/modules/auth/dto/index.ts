import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsStrongPassword,
} from 'class-validator';
import {
  ISignUpRequest,
  ISignResponse,
  ISignUp,
} from 'src/common/interfaces/auth';

export class SignUpRequestDto implements ISignUpRequest {
  @ApiProperty({
    type: String,
    description: 'Email of user',
    default: 'example@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    type: String,
    description: 'Password of user',
    default: 'Qwerty123!',
  })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}

export class SignUpDto implements ISignUp {
  @ApiProperty({
    type: String,
    description: 'Email of user',
    default: 'example@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    type: String,
    description: 'Uniq number of confirmation',
    default: '411575',
  })
  @IsNotEmpty()
  @IsNumberString()
  code: string;
}

export class SingResponseDto implements ISignResponse {
  @ApiProperty({
    type: String,
    description: 'Access token',
  })
  accessToken: string;
}
