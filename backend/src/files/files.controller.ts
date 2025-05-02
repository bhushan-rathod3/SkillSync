import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Body,
  Param,
  UseGuards,
  Req,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { createReadStream } from 'fs';
import * as mime from 'mime-types';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/files',
        filename: (req, file, callback) => {
          const uniqueSuffix = uuidv4();
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('projectId') projectId: number,
    @Req() req,
  ) {
    const uploaderId = req.user.id;
    return this.filesService.upload(file, projectId, uploaderId);
  }

  @Get('project/:projectId')
  async getProjectFiles(@Param('projectId') projectId: number, @Req() req) {
    return this.filesService.findByProject(
      projectId,
      req.user.id,
      req.user.role,
    );
  }

  @Get('download/:filename')
  @UseGuards(JwtAuthGuard)
  async downloadFile(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res,
  ) {
    try {
      // Set the file path
      const filePath = join(process.cwd(), 'uploads', 'files', filename);

      // Determine the content type based on file extension
      const contentType = mime.lookup(filePath) || 'application/octet-stream';

      // Set appropriate headers
      res.set({
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      });

      // Create a read stream from the file
      const fileStream = createReadStream(filePath);

      // Return the file as a streamable response
      return new StreamableFile(fileStream);
    } catch (error) {
      console.error('Error downloading file:', error);
      res.status(404).send({ message: 'File not found' });
    }
  }
}
