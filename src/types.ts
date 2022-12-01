import { User } from "./entities";
import { Socket } from 'socket.io';
import { Request } from 'express';

export type Done = (err: Error, user: User) => void;
export interface AuthenticatedSocket extends Socket {
  user: User;
}
export interface AuthenticatedRequest extends Request {
  user: User;
}