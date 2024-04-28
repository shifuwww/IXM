import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { FileFilterDto, FilesPageableResponseDataDto, GetFileDto } from './dto';
import { AtGuard } from '../auth/guards';
import { IAtJwt } from 'src/common/interfaces/auth';
import { FileMapper } from './mapper';

@UseGuards(AtGuard)
@ApiBearerAuth()
@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private readonly service: FileService) {}

  @ApiOperation({ summary: 'Get list of files' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    type: FilesPageableResponseDataDto,
  })
  @Get('list')
  public async getListOfFiles(
    @Query() filter: FileFilterDto,
  ): Promise<FilesPageableResponseDataDto> {
    return await this.service.getListOfFiles(filter);
  }

  @ApiOperation({ summary: 'Get user list of files' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    type: FilesPageableResponseDataDto,
  })
  @Get('my-list')
  public async getMyListOfFiles(
    @Query() filter: FileFilterDto,
    @Req() request: Request & { user: IAtJwt },
  ): Promise<FilesPageableResponseDataDto> {
    const userJwt = request.user;
    return await this.service.getListOfFiles(filter, userJwt.sub);
  }

  @ApiOperation({ summary: 'Get file info by id' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    type: GetFileDto,
  })
  @Get(':id')
  public async getFileById(@Param('id') id: string): Promise<GetFileDto> {
    const file = await this.service.getFileById(id);
    return FileMapper.map(file);
  }

  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    type: GetFileDto,
  })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
    @Req() request: Request & { user: IAtJwt },
  ): Promise<GetFileDto> {
    const userJwt = request.user;
    return await this.service.uploadFile(file, userJwt.sub);
  }

  @ApiOperation({ summary: 'Update file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    type: GetFileDto,
  })
  @Put('update/:id')
  @UseInterceptors(FileInterceptor('file'))
  public async updateFile(
    @Param('id') id: string,
    @UploadedFile()
    file: Express.Multer.File,
    @Req() request: Request & { user: IAtJwt },
  ): Promise<GetFileDto> {
    const userJwt = request.user;
    return await this.service.updateFile(file, id, userJwt.sub);
  }

  @ApiOperation({ summary: 'Download file by id' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
  })
  @Get('download/:id')
  public async downloadFileById(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<void> {
    const file = await this.service.downloadFile(id);
    response.contentType(file.mimeType);
    response.send(file.data);
  }

  @ApiOperation({ summary: 'Delete file by id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
  })
  @Delete('delete/:id')
  public async deleteFileById(
    @Param('id') id: string,
    @Req() request: Request & { user: IAtJwt },
  ): Promise<void> {
    const userJwt = request.user;
    return await this.service.deleteFile(id, userJwt.sub);
  }
}
