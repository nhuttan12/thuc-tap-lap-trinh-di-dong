import { format, transports } from 'winston';
import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { HttpConfig } from '../config/interface/http.interface';
import {
  ConsoleTransportInstance,
  FileTransportInstance,
} from 'winston/lib/winston/transports';

/*
 * @description: Custom format for logging
 * */
const customFormat = format.printf(({ timestamp, level, stack, message }) => {
  // 1. Cast timestamp to string
  const finalTimestamp = timestamp as string;

  // 2. Check if stack is string, if not check if message is string, if not convert message to string
  const finalMessage: string =
    typeof stack === 'string'
      ? stack
      : typeof message === 'string'
        ? message
        : JSON.stringify(message);

  // 3. Return final message log
  return `${finalTimestamp} - [${level
    .toUpperCase()
    .padEnd(7)}] - ${finalMessage}`;
});

/*
 * @description: Options for logging
 * */
const options = {
  file: {
    filename: 'error.log',
    level: 'error',
  },
  console: {
    level: 'silly',
  },
  combine: {
    filename: 'combine.log',
    level: 'info',
  },
};

/*
 * @description: Format and transport for development environment
 * */
const devFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  customFormat,
);

const devTransports: ConsoleTransportInstance[] = [
  new transports.Console(options.console),
];

/*
 * @description: Format and transport for production environment
 * */
const prodFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.json(),
);

const prodTransports: FileTransportInstance[] = [
  new transports.File(options.file),
  new transports.File(options.combine),
];

@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // 1. Get environment from config service
        const environment: HttpConfig = configService.httpConfig;

        // 2. Check if environment is production or not
        const isProduction: boolean = environment.environment === 'production';

        // 3. Return format and transport base on the environment
        return {
          format: isProduction ? prodFormat : devFormat,
          transports: isProduction ? prodTransports : devTransports,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class LoggerModule {}
