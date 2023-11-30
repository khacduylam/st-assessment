import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseObjectDto } from 'src/common/dtos/base.dto';

export class FeedbackDto extends BaseObjectDto {
  @ApiProperty()
  @Expose()
  postId: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  body: string;
}
