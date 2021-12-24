import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 20 })
  username: string;

  @Column("varchar", { length: 100 })
  password: string;

  @Column("varchar", { length: 20 })
  phone: string;

  @Column("boolean", { default: true })
  active: boolean;

  @CreateDateColumn()
  created_at: string;
}
