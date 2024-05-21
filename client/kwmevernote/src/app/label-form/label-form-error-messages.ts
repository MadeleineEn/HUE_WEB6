export class ErrorMessage {
  constructor(
    public forControl: string,
    public forValidator: string,
    public text: string
  ) { }
}

export const LabelFormErrorMessages = [
  new ErrorMessage('title', 'required','Ein Titel muss angegeben werden.'),
  new ErrorMessage('user_id','required','Ein*e Benutzer*in muss ausgewählt werden.')]
