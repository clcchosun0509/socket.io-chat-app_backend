import { INestApplication } from '@nestjs/common';
import * as session from 'express-session';
import * as connectPgSimple from 'connect-pg-simple';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolConfig } from 'pg';
import * as passport from 'passport';
import { ValidationPipe } from '@nestjs/common';

import { WebSocketAdapter } from './gateway/gateway.adapter';

export default (app: INestApplication) => {
  const configService = app.get<ConfigService>(ConfigService);
  const pgSession = connectPgSimple(session);
  const pgPoolConfig: PoolConfig = {
    database: configService.get<string>('DB_NAME'),
    user: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    port: configService.get<number>('DB_PORT'),
    max: 10,
    idleTimeoutMillis: 1000,
    connectionTimeoutMillis: 1000,
  };

  const expressSession = session({
    secret: configService.get<string>('SESSION_SECRET'),
    resave: false,
    saveUninitialized: false,
    store: new pgSession({
      pool: new Pool(pgPoolConfig),
      createTableIfMissing: true,
    }),
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(new WebSocketAdapter(app, expressSession));
  app.use(expressSession);
  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors({
    origin: true,
    credentials: true,
  });
};
