import { Note } from "./note";
import { Label } from "./label";
import { User } from "./user";
import { Image } from "./image";
export class Todo {
  constructor(public id: number,
              public title: string,
              public due_date: Date,
              public is_public: boolean,
              public created_at: Date,
              public updated_at: Date,
              public description?: string,
              public note_id?: number,
              public labels?: Label[],
              public users?: User[],
              public images?: Image[],
              public notes?: Note[]) { }
}
