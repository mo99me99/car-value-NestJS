import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Report } from 'src/reports/report.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted User With ID ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Update User With ID ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User With ID ', this.id);
  }
}
