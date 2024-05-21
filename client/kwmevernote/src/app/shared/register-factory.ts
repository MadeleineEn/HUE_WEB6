import {Register} from "./register";

export class RegisterFactory {
  static empty(): Register {
    return new Register(0, '', true,new Date(), new Date(),
      [{id: 0, title: '',user_id:1}],[{id:0,username:'',firstname:'',lastname:'',email:'',password:''}]);
  }

  static fromObject(rawRegister: any): Register {
    return new Register(
      rawRegister.id, rawRegister.title, rawRegister.is_public, rawRegister.created_at,
      rawRegister.updated_at, rawRegister.notes, rawRegister.users);
  }
}

