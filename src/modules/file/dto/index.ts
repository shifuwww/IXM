import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IFilesPageableReponseData,
  IFilterFile,
  IGetFile,
} from 'src/common/interfaces/file';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetFileDto implements IGetFile {
  @ApiProperty({
    type: String,
    description: 'Id of file',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'Name of file',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'Type of file',
  })
  type: string;

  @ApiProperty({
    type: String,
    description: 'Mime type of file',
  })
  mimeType: string;

  @ApiProperty({
    type: Number,
    description: 'Size of file in byte',
  })
  size: number;

  @ApiProperty({
    type: Date,
    description: 'Date of creation',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Date of updating',
  })
  updatedAt: Date;
}

export class FileFilterDto implements IFilterFile {
  @ApiPropertyOptional({
    type: Number,
    description: 'Number of page',
    example: 1,
  })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }: { value: number }) =>
    value > 0 && value < 10000 ? value : 1,
  )
  page = 1;

  @ApiPropertyOptional({
    type: Number,
    description: 'Number of elements on one page',
    example: 10,
  })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }: { value: number }) =>
    value > 0 && value < 100 ? value : 10,
  )
  limit = 10;

  @ApiPropertyOptional({
    type: String,
    description: 'Type of sort (desc or asc)',
    example: 'desc',
  })
  @IsString()
  @Transform(({ value }) => (value === 'desc' ? 'DESC' : 'ASC'))
  @IsOptional()
  order: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    type: String,
    description: 'Field of sort',
    example: 'createdAt',
  })
  @IsString()
  @IsOptional()
  orderField = 'createdAt';

  public getOrderedField(fields: string[]) {
    return fields.includes(this.orderField) ? this.orderField : 'createdAt';
  }

  public countOffset(): number {
    return (this.page - 1) * this.limit;
  }
}

export class FilesPageableResponseDataDto implements IFilesPageableReponseData {
  @ApiProperty({
    type: Number,
    description: 'Amount of current entities',
  })
  count: number;

  @ApiProperty({
    type: Number,
    description: 'Amount of all entities',
  })
  total: number;

  @ApiProperty({
    type: Number,
    description: 'Amount of all pages',
  })
  pageCount: number;

  @ApiProperty({
    type: Number,
    description: 'Current page',
  })
  page: number;

  @ApiProperty({
    type: GetFileDto,
    description: 'Files',
  })
  data: GetFileDto[];
}
