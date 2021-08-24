import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  url: string;

  @Column({ nullable: false, unique: true })
  slug: string;
}
