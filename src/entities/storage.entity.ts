import { StorageType } from 'src/config/enum.config'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm'

@Entity()
export class Storage {
  @PrimaryGeneratedColumn() id: number

  @Column({
    type: 'simple-enum',
    enum: StorageType
  })
  type: StorageType

  @Column({ unique: true })
  name: string

  @Column()
  secretId: string

  @Column()
  secretKey: string

  @Column()
  action: string

  @Column()
  bucket: string

  @Column()
  region: string

  @Column()
  prefix: string
}
