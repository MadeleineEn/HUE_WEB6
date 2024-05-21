import {Label} from "./label";

export class LabelFactory {
  static empty():Label {
    return new Label(0, '',1, new Date(), new Date(),
      [{id:0,username:'',firstname:'',lastname:'',email:'',password:''}]);
  }

  static fromObject(rawLabel: any): Label {
    return new Label (rawLabel.id, rawLabel.title, rawLabel.user_id,
      rawLabel.created_at, rawLabel.updated_at, rawLabel.users);
  }
}
