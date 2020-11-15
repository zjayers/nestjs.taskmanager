import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import config from 'config';

const {
  host,
  password,
  port,
  type,
  username,
  database,
  synchronize,
} = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: type,
  host: process.env.RDS_HOSTNAME || host,
  port: process.env.RDS_PORT || port,
  username: process.env.RSS_USERNAME || username,
  password: process.env.RDS_PASSWORD || password,
  database: process.env.RDS_DB_NAME || database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: process.env.TYPEORM_SYNC || synchronize,
};
