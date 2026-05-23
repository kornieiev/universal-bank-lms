import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const createDataSourceOptions = (
  config: ConfigService,
): DataSourceOptions => ({
  type: 'postgres',
  host: config.get<string>('DB_HOST', 'localhost'),
  port: config.get<number>('DB_PORT', 5432),
  username: config.get<string>('DB_USERNAME', 'postgres'),
  password: config.get<string>('DB_PASSWORD', 'postgres'),
  database: config.get<string>('DB_NAME', 'bank'),
  synchronize: config.get<string>('DB_SYNCHRONIZE', 'false') === 'true',
  logging: config.get<string>('DB_LOGGING', 'false') === 'true',
  entities: [__dirname + '/**/*.entity.{ts,js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
});
