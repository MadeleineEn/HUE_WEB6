import { Register } from "./register";
export { Register } from "./register";
import { Todo } from "./todo";
export { Todo } from "./todo";
import { Image } from "./image";
export { Image } from "./image";

export class User {
  constructor(public id: number,
              public username: string,
              public firstname: string,
              public lastname: string,
              public email: string,
              public password: string,
              public email_verified_at?: Date,
              public remember_token?: string,
              public role?: string,
              public image?: Image,
              public todos?: Todo[],
              public registers?: Register[]
  ) { }
}
