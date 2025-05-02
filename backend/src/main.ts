import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as fs from 'fs';
import * as express from 'express';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import * as mime from 'mime-types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation pipes globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      // Return user-friendly validation errors
      exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce((acc, error) => {
          if (error.constraints) {
            acc[error.property] = Object.values(error.constraints).join(', ');
          } else {
            acc[error.property] = 'Invalid value';
          }
          return acc;
        }, {});

        return new BadRequestException({
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    }),
  );

  // Ensure upload directories exist
  const uploadDirs = ['./uploads', './uploads/profiles', './uploads/messages'];

  for (const dir of uploadDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Serve static files with proper content type detection
  app.use(
    '/uploads',
    express.static(join(__dirname, '..', 'uploads'), {
      setHeaders: (res, filePath) => {
        // Set appropriate content type based on file extension
        const contentType = mime.lookup(filePath) || 'application/octet-stream';
        res.set('Content-Type', contentType);

        // For message attachments, set as attachment to force download
        if (filePath.includes('/messages/')) {
          // Note: We're not setting Content-Disposition here because
          // message attachments should be handled by the controller endpoint
          // that properly handles the original filename
          console.log('Static file request for message attachment:', filePath);
        } else {
          // For other files like profile images, serve inline
          res.set('Content-Disposition', 'inline');
        }
      },
    }),
  );

  // Log the static file path for debugging
  console.log('Serving static files from:', join(__dirname, '..', 'uploads'));

  app.enableCors({
    origin: 'http://localhost:5173', // Allow requests from your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow cookies if needed
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
