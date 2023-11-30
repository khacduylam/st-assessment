import { Column, Entity } from 'typeorm';
import { DBTable } from '../../common/constants/db.constant';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity({ name: DBTable.Feedback })
export class Feedback extends BaseEntity {
  constructor(partial: Partial<Feedback>) {
    super();
    Object.assign(this, partial);
  }

  //@Column()
  //userId: number;

  @Column()
  postId: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  body: string;
}
