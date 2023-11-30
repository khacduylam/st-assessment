import {
  Controller,
  HttpStatus,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FeedbackDto } from './dto/res/feedback.dto';
import { FeedbacksService } from './feedbacks.service';
import {
  createPaginationResponseDto,
  createResponseDto,
} from 'src/common/utils/response.util';
import { CrudApi } from 'src/common/decorators/controller.decorator';
import { FindFeedbacksDto } from './dto/req/find-feedbacks.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, storageConfig } from './feedbacks.upload';

@ApiTags('feedbacks')
@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @CrudApi({
    swagger: {
      summary: 'Upload feedbacks data',
      httpCode: HttpStatus.OK,
      successResponseOptions: { type: 'ok', cls: String },
    },
    nest: { method: 'Post', path: '/upload', isPublic: true }, // NOTE: public for testing
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storageConfig,
      fileFilter,
    }),
  )
  async uploadCSVFile(@UploadedFile() file: Express.Multer.File) {
    await this.feedbacksService.handleUploadedFile(file);

    return createResponseDto(String, 'Ok');
  }

  @CrudApi({
    swagger: {
      summary: 'Find and paginate feedbacks',
      httpCode: HttpStatus.OK,
      successResponseOptions: { type: 'pagination', cls: FeedbackDto },
    },
    nest: { method: 'Get', path: '/', isPublic: true }, // NOTE: public for testing
  })
  async findAndPaginate(@Query() queryDto: FindFeedbacksDto) {
    const paginateResult =
      await this.feedbacksService.findAndPaginate(queryDto);

    return createPaginationResponseDto(FeedbackDto, paginateResult);
  }
}
