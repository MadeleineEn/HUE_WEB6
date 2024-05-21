import {Todo} from "./todo";
import {Label, Note, User} from "./note";

export class TodoFactory {
  static empty(): Todo{
    return new Todo(0,'',new Date(),true,new Date(),new Date(),'',
        1,[{id:1,title:'',user_id:1, created_at:new Date(), updated_at: new Date()}],
      [{id:0,username:'',firstname:'',lastname:'',email:'',password:''}],[{id:0,title:'',url:''}],
      [{id:0,title:'',description:'',user_id:1}]);
  }

  static fromObject(rawTodo: any): Todo {
    return new Todo(
      rawTodo.id, rawTodo.title, rawTodo.due_date, rawTodo.is_public, rawTodo.created_at, rawTodo.updated_at,
      rawTodo.description, rawTodo.note_id, rawTodo.labels, rawTodo.users,rawTodo.images, rawTodo.notes
    );
  }
}
