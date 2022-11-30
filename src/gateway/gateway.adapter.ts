import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as sharedSession from 'express-socket.io-session';
import * as Express from 'express';
import { AuthenticatedSocket } from '../types';
import { User } from '../entities';

export class WebSocketAdapter extends IoAdapter {
  constructor(
    private readonly app: INestApplication,
    private readonly expressSession: Express.RequestHandler,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options);
    server.use(
      sharedSession(this.expressSession, {
        autoSave: true,
        saveUninitialized: false,
      }),
    );
    server.use((socket: AuthenticatedSocket, next) => {
      try {
        const user: User = (socket as any).handshake.session.passport.user;
        socket.user = user;
      } catch (err) {
        return next(new Error('Not Authenticated.'));
      }
      next();
    });
    return server;
  }
}
