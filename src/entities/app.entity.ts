import { AppType } from 'src/config/enum.config'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm'

@Entity()
export class App {
  @PrimaryGeneratedColumn() id: number

  @Column({ unique: true })
  name: string

  @Column({
    type: 'simple-enum',
    enum: AppType
  })
  type: AppType

  @Column()
  appid: string

  @Column()
  response_type: string

  @Column()
  scope: string

  @Column()
  redirect_uri: string

  @Column({ nullable: true })
  agentid: string // 企业微信

  @Column({ nullable: true })
  secret: string
}
