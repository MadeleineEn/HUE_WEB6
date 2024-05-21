import { User } from "./user";
export class Label {
  constructor(public id: number,
              public title: string,
              public user_id: number,
              public created_at: Date,
              public updated_at: Date,
              public users?: User[]) { }
}
