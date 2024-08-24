import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

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
