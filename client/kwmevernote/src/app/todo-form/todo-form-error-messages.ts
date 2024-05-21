export class ErrorMessage {
  constructor(
    public forControl: string,
    public forValidator: string,
    public text: string
  ) { }
}

export const TodoFormErrorMessages = [
  new ErrorMessage('title', 'required','Ein Titel muss angegeben werden.'),
  new ErrorMessage('due_date','required','Ein Fälligkeitsdatum muss angegeben werden.'),
  new ErrorMessage('is_public','required','Privat oder Öffentlich muss ausgewählt werden.')
]
