import { FileEntity } from 'src/entities';
import { GetFileDto } from '../dto';

export class FileMapper {
  static map(item: FileEntity): GetFileDto {
    if (!item) return null;
    return {
      id: item.id,
      name: item.name,
      type: item.type,
      mimeType: item.mimeType,
      size: item.size,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
  static mapItems(items: FileEntity[]): GetFileDto[] {
    return items.map((i) => FileMapper.map(i));
  }
}
