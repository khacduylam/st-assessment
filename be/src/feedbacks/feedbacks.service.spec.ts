import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvSchema } from '../env.schema';
import { CreateFeedbackDto } from './dto/req/create-feedback.dto';
import { FindFeedbacksDto } from './dto/req/find-feedbacks.dto';
import { Feedback } from './entities/feedback.entity';
import { FeedbacksService } from './feedbacks.service';
import * as MockData from './mock/data.json';

describe('FeedbacksService', () => {
  let feedbacksService: FeedbacksService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: EnvSchema,
        }),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get<string>('TEST_DB_HOST'),
            port: configService.get<number>('TEST_DB_PORT'),
            username: configService.get<string>('TEST_DB_USER'),
            password: configService.get<string>('TEST_DB_PASSWORD'),
            database: configService.get<string>('TEST_DB_NAME'),
            entities: [Feedback],
            synchronize: configService.get<boolean>('TEST_DB_SYNC'),
            retryAttempts: 3,
            logging: configService.get<boolean>('TEST_DB_LOG'),
          }),
        }),
        TypeOrmModule.forFeature([Feedback]),
      ],
      providers: [FeedbacksService],
    }).compile();

    feedbacksService = moduleRef.get<FeedbacksService>(FeedbacksService);
  });

  it('should be initialized', () => {
    expect(feedbacksService).toBeDefined();
  });

  describe('createMulti', () => {
    it('should create N feedbacks', async () => {
      const createDtoList = MockData.map(
        (rawItem: any) =>
          ({
            postId: rawItem.postId,
            name: rawItem.name,
            email: rawItem.email.toLowerCase(),
            body: rawItem.body,
          }) as CreateFeedbackDto,
      );

      const feedbacksFromDB = await feedbacksService.createMulti(createDtoList);

      for (const mockItem of MockData) {
        const mockItemEmail = mockItem.email.toLowerCase();
        const isInserted = feedbacksFromDB.some(
          (dbItem) => dbItem.email === mockItemEmail,
        );

        expect(isInserted).toEqual(true);
      }
    });
  });

  describe('findOne', () => {
    it('should return a record that matches email', async () => {
      for (const mockItem of MockData) {
        const mockItemEmail = mockItem.email.toLowerCase();
        const dbItem = await feedbacksService.findOne({ email: mockItemEmail });

        expect(dbItem).not.toBeNull();
        expect(dbItem.email).toEqual(mockItemEmail);
      }
    });

    it('should return null with an email that does not exist', async () => {
      const mockItemEmail = `${Math.random()}.${Date.now()}@example.com`;
      const dbItem = await feedbacksService.findOne({ email: mockItemEmail });

      expect(dbItem).toBeNull();
    });
  });

  describe('findAndPaginate', () => {
    it('should return true pagination result', async () => {
      const mockDataSize = MockData.length;
      const queryPage = 1;
      const queryLimit = Math.ceil(mockDataSize / 2);
      const result = await feedbacksService.findAndPaginate({
        page: queryPage,
        limit: queryLimit,
      } as FindFeedbacksDto);

      expect(result).not.toBeNull();
      expect(result.meta).not.toBeNull();
      expect(result.items).not.toBeNull();
      expect(result.meta.itemCount).toEqual(result.items.length);
      expect(result.meta.totalItems).toEqual(mockDataSize);
      expect(result.meta.currentPage).toEqual(queryPage);
      expect(result.meta.totalPages).toEqual(2);
    });
  });

  describe('delete', () => {
    it('should delete a record that matches email', async () => {
      for (const mockItem of MockData) {
        const mockItemEmail = mockItem.email.toLowerCase();
        await feedbacksService.delete({ email: mockItemEmail });

        const dbItem = await feedbacksService.findOne({ email: mockItemEmail });

        expect(dbItem).toBeNull();
      }
    });
  });

  afterAll(async () => {
    for (const mockItem of MockData) {
      const mockItemEmail = mockItem.email.toLowerCase();
      await feedbacksService.delete({ email: mockItemEmail }, true);
    }
  });
});
