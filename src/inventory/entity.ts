import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({ default: 0 })
  quantity!: number;

  @Column({name:'product__id'})
  product__id! :string;
}