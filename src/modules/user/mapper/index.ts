import { UserEntity } from 'src/entities';
import { GetUserDto } from '../dto';

export class UserMapper {
  static map(item: UserEntity): GetUserDto {
    if (!item) return null;
    return {
      id: item.id,
      email: item.email,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
  static mapItems(items: UserEntity[]): GetUserDto[] {
    return items.map((i) => UserMapper.map(i));
  }
}
