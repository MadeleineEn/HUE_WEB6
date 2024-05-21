import { Image } from "./image";
export { Image } from "./image";
import { Register } from "./register";
export { Register } from "./register";
import { User } from "./user";
export { User } from "./user";
import { Label } from "./label";
export { Label } from "./label";
import { Todo } from "./todo";
export { Todo } from "./todo";

export class Note {
  constructor(
    public id: number,
    public title: string,
    public user_id: number,
    public description?: string,
    public register_id?: number,
    public labels?: Label[],
    public images?: Image[],
    public todos?: Todo[]
  ) {
  }
}
