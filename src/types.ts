import { User } from "./entities";

export type Done = (err: Error, user: User) => void;