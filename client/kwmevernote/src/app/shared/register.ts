import {Note, User} from "./note";
export { Note } from "./note";

export class Register {
  constructor(public id: number,
              public title: string,
              public is_public: boolean,
              public created_at: Date,
              public updated_at: Date,
              public notes?: Note[],
              public users?: User[]) { }
}
