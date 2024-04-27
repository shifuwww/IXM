import { ApiProperty } from '@nestjs/swagger';
import { IGetUser } from 'src/common/interfaces/user';

export class GetUserDto implements IGetUser {
  @ApiProperty({
    type: String,
    description: 'Id of user',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'Email of user',
  })
  email: string;

  @ApiProperty({
    type: Date,
    description: 'Date of create',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Date of update',
  })
  updatedAt: Date;
}
