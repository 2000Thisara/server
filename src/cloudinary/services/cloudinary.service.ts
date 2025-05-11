import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
const toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {


      const upload = v2.uploader.upload_stream(
  { 
    folder: 'modern-commerce',
    background_removal: "cloudinary_ai"  // Enable Cloudinary AI background removal
  },
  (error, result) => {
    if (error) return reject(error);
    resolve(result);
  }
);

      toStream(file.buffer).pipe(upload);
    });
  }



  async uploadLogo(
    file: Express.Multer.File
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {


      const upload = v2.uploader.upload_stream(
  { 
    folder: 'modern-commerce'
  },
  (error, result) => {
    if (error) return reject(error);
    resolve(result);
  }
);

      toStream(file.buffer).pipe(upload);
    });
  }


}
