export class ErrorMessage {
  constructor(
    public forControl: string,
    public forValidator: string,
    public text: string
  ) {
  }
}

export const RegisterFormErrorMessages = [
  new ErrorMessage('title', 'required', 'Ein Titel muss angegeben werden.'),
  new ErrorMessage('is_public', 'required', 'Privat oder Öffentlich auswählen.'),
  new ErrorMessage('users', 'required', 'Es muss mind. 1 Nutzer*in ausgewählt werden.')]

