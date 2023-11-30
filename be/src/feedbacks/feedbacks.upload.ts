import * as multer from 'multer';
import { Request } from 'express';
import { MAX_FILE_SIZE } from './feedbacks.constant';

export const storageConfig = multer.diskStorage({
  destination: (_, file: Express.Multer.File, cb: any) => cb(null, './uploads'),
  filename: (_, file: Express.Multer.File, cb: any) => {
    cb(null, Date.now() + '_' + file.originalname);
  },
});

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: any,
) => {
  if (file.mimetype !== 'text/csv') {
    return cb(new Error('Invalid file type'));
  }

  if (file.size > MAX_FILE_SIZE) {
    return cb(new Error('Invalid file size'));
  }

  return cb(null, true);
};
