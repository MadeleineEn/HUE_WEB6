import {Note} from "./note";

export class NoteFactory {
  static empty():Note {
    return new Note(0,'',1,'',1,
      [{id:0,title:'',user_id:1, created_at: new Date(), updated_at: new Date()}],
      [{id:0,title:'',url:''}]);
  }

  static fromObject(rawNote: any): Note {
    return new Note(
      rawNote.id, rawNote.title, rawNote.user_id, rawNote.description,
      rawNote.register_id, rawNote.labels, rawNote.images, rawNote.todos
    );
  }
}
