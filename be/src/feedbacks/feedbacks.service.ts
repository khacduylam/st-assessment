import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { BaseService } from '../common/services/base.service';
import { CreateFeedbackDto } from './dto/req/create-feedback.dto';
import { readCsvFile } from '../common/utils/csv.util';

@Injectable()
export class FeedbacksService extends BaseService<Feedback> {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbacksRepository: Repository<Feedback>,
  ) {
    super(feedbacksRepository);
  }

  async createMulti(createDtoList: CreateFeedbackDto[]) {
    const entities = createDtoList.map(
      (createDto) => new Feedback({ ...createDto }),
    );
    return await this.feedbacksRepository.save(entities);
  }

  async handleUploadedFile(file: Express.Multer.File) {
    const rawFeedbacks = await readCsvFile(file.path);
    const createDtoList = rawFeedbacks.map(
      (rawItem: any) =>
        ({
          postId: rawItem.postId,
          name: rawItem.name,
          email: rawItem.email.toLowerCase(),
          body: rawItem.body,
        }) as CreateFeedbackDto,
    );

    await this.createMulti(createDtoList);

    return rawFeedbacks.length;
  }
}
