import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';
import { createReadStream } from 'fs';
import * as mime from 'mime-types';
import { Request, Response } from 'express';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('project/:projectId')
  @UseInterceptors(
    FileInterceptor('attachment', {
      storage: diskStorage({
        destination: './uploads/messages',
        filename: (req: Request, file, callback) => {
          const uniqueSuffix = uuidv4();
          const ext = extname(file.originalname);
          // Store the original filename in the request object for later use
          req.originalFilename = file.originalname;
          callback(null, `message-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  send(
    @Param('projectId') projectId: number,
    @Body() createMessageDto: CreateMessageDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    const senderId = req.user.id;

    // Add the attachment URL to the message if a file was uploaded
    if (file) {
      // Store both the generated filename and the original filename
      // Format: generatedFilename|originalFilename
      // Make sure to encode the original filename to handle special characters
      const encodedOriginalFilename = encodeURIComponent(req.originalFilename);
      createMessageDto.attachmentUrl = `${file.filename}|${encodedOriginalFilename}`;

      console.log('File uploaded:', {
        generatedFilename: file.filename,
        originalFilename: req.originalFilename,
        encodedFilename: encodedOriginalFilename,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
      });
    }

    return this.messagesService.send(createMessageDto, projectId, senderId);
  }

  @Get('project/:projectId')
  getMessages(@Param('projectId') projectId: number, @Req() req) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.messagesService.getMessages(projectId, userId, userRole);
  }

  @Get('conversations')
  getConversations(@Req() req) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.messagesService.getConversations(userId, userRole);
  }

  @Get('attachment/:filename')
  @UseGuards(JwtAuthGuard)
  async getAttachment(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      console.log('Raw filename parameter:', filename);

      // The filename parameter might be URL-encoded, so decode it first
      const decodedFilename = decodeURIComponent(filename);
      console.log('Decoded filename:', decodedFilename);

      // The filename might contain the original filename after a pipe character
      // Format: generatedFilename|originalFilename
      const parts = decodedFilename.split('|');
      console.log('Split parts:', parts);

      const storedFilename = parts[0]; // The actual filename on disk
      const originalFilename =
        parts.length > 1 ? decodeURIComponent(parts[1]) : storedFilename; // The original filename if available

      console.log('Stored filename:', storedFilename);
      console.log('Original filename:', originalFilename);

      // Set the file path using the stored filename
      const filePath = join(
        process.cwd(),
        'uploads',
        'messages',
        storedFilename,
      );

      // Check if file exists
      if (!require('fs').existsSync(filePath)) {
        console.error('File not found:', filePath);
        return res.status(404).send({
          message: 'Attachment not found',
          details: {
            requestedFile: storedFilename,
            path: filePath,
          },
        });
      }

      // Determine the content type based on file extension
      const contentType =
        mime.lookup(originalFilename) || 'application/octet-stream';

      // Log the content type for debugging
      console.log('Serving file:', {
        storedFilename,
        originalFilename,
        contentType,
        filePath,
      });

      // Read the file as a buffer
      const fileBuffer = require('fs').readFileSync(filePath);

      // Set appropriate headers
      res.setHeader('Content-Type', contentType);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(originalFilename)}"`,
      );
      res.setHeader('Content-Length', fileBuffer.length);

      // Send the file buffer
      return res.send(fileBuffer);
    } catch (error) {
      console.error('Error serving attachment:', error);
      if (!res.headersSent) {
        res.status(500).send({
          message: 'Error serving attachment',
          error: error.message,
          stack:
            process.env.NODE_ENV !== 'production' ? error.stack : undefined,
        });
      }
    }
  }
}
