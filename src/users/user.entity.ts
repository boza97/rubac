import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from './enum/user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: UserRole.DEFAULT })
  role: UserRole;
}
