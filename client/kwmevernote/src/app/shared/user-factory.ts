import {User} from "./user";
export class UserFactory {
  static empty():User {
    return new User(0,'','','','','',
      new Date(),'','',{id:0,title:'',url:''},
      [{id:0,title:'',due_date:new Date(), is_public: true,created_at: new Date(), updated_at: new Date()}],
      [{id:0, title:'', is_public: true, created_at: new Date(), updated_at: new Date(),
        users:[{id:0,username:'',firstname:'',lastname:'',email:'',password:''}]}]);
  }

  static fromObject(rawUser: any): User {
    return new User(
      rawUser.id, rawUser.username, rawUser.firstname, rawUser.lastname, rawUser.email,
      rawUser.password, rawUser.email_verified_at, rawUser.remember_token, rawUser.role,
      rawUser.image, rawUser.todos, rawUser.registers
    );
  }

}
