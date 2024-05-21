export class ErrorMessage {
  constructor(
    public forControl: string,
    public forValidator: string,
    public text: string
  ) { }
}

  export const NoteFormErrorMessages = [
    new ErrorMessage('title', 'required','Ein Notiztitel muss angegeben werden'),
    new ErrorMessage('user_id', 'required','Ein*e Benutzer*in muss ausgewählt werden'),
    new ErrorMessage('register_id', 'required','Eine Liste muss ausgewählt werden')]
