import { User } from "./entities";
import { Socket } from 'socket.io';

export type Done = (err: Error, user: User) => void;
export interface AuthenticatedSocket extends Socket {
  user?: User;
}