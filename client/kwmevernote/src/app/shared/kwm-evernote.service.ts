import { Injectable } from '@angular/core';
import {Note, Image, Label, Register, Todo, User} from "./note";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, retry, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class KwmEvernoteService {
  private api = 'http://kwmevernote.s2110456037.student.kwmhgb.at/api';
  constructor(private http:HttpClient) {
  }

  getAllNotes():Observable<Array<Note>>{
    return this.http.get<Array<Note>>(`${this.api}/notes`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler))
  }

  getAllLabels():Observable<Array<Label>>{
    return this.http.get<Array<Label>>(`${this.api}/labels`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler))
  }

  getAllRegisters():Observable<Array<Register>>{
    return this.http.get<Array<Register>>(`${this.api}/registers`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler))
  }

  getAllTodos():Observable<Array<Todo>>{
    return this.http.get<Array<Todo>>(`${this.api}/todos`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler))
  }

  getAllUser():Observable<Array<User>>{
    return this.http.get<Array<User>>(`${this.api}/users`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler))
  }

  getSingleNote(id: number) : Observable<Note> {
    return this.http.get<Note>(`${this.api}/notes/${id}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler))
  }

  getSingleLabel(id: number) : Observable<Label> {
    return this.http.get<Label>(`${this.api}/labels/${id}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler))
  }

  getSingleRegister(id: number) : Observable<Register> {
    return this.http.get<Register>(`${this.api}/registers/${id}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler))
  }

  getSingleTodo(id: number) : Observable<Todo> {
    return this.http.get<Todo>(`${this.api}/todos/${id}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler))
  }

  getSingleUser(id: number) : Observable<User> {
    return this.http.get<User>(`${this.api}/users/${id}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler))
  }

  private errorHandler(error: Error | any):Observable<any>{
    return throwError(error);
  }

  //Erstellen-Methoden
  createNote(note: Note): Observable<any> {
    return this.http.post(`${this.api}/notes`, note)
      .pipe(retry(3)).pipe(catchError(this.errorHandler))
  }

  createLabel(label: Label): Observable<any> {
    return this.http.post(`${this.api}/labels`, label)
      .pipe(retry(3)).pipe(catchError(this.errorHandler))
  }

  createRegister(register: Register): Observable<any> {
    return this.http.post(`${this.api}/registers`, register)
      .pipe(retry(3)).pipe(catchError(this.errorHandler))
  }

  createTodo(todo: Todo): Observable<any> {
    return this.http.post(`${this.api}/todos`, todo)
      .pipe(retry(3)).pipe(catchError(this.errorHandler))
  }

  //Update-Methoden
  updateNote(note: Note): Observable<any> {
    return this.http.put(`${this.api}/notes/${note.id}`, note)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  updateLabel(label: Label): Observable<any> {
    return this.http.put(`${this.api}/labels/${label.id}`, label)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  updateRegister(register: Register): Observable<any> {
    return this.http.put(`${this.api}/registers/${register.id}`, register)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  updateTodo(todo: Todo): Observable<any> {
    return this.http.put(`${this.api}/todos/${todo.id}`, todo)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  //Löschen-Methoden
  removeNote(id: number): Observable<any> {
    return this.http.delete(`${this.api}/notes/${id}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  removeLabel(id: number): Observable<any> {
    return this.http.delete(`${this.api}/labels/${id}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  removeRegister(id: number): Observable<any> {
    return this.http.delete(`${this.api}/registers/${id}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  removeTodo(id: number): Observable<any> {
    return this.http.delete(`${this.api}/todos/${id}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  removeUser(id: number): Observable<any> {
    return this.http.delete(`${this.api}/users/${id}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getAllSearchNote(searchTerm: string): Observable<Array<Note>> {
    return this.http.get<Array<Note>>(`${this.api}/notes/search/${searchTerm}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getAllSearchLabel(searchTerm: string): Observable<Array<Label>> {
    return this.http.get<Array<Label>>(`${this.api}/labels/search/${searchTerm}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getAllSearchRegister(searchTerm: string): Observable<Array<Register>> {
    return this.http.get<Array<Register>>(`${this.api}/registers/search/${searchTerm}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getAllSearchTodo(searchTerm: string): Observable<Array<Todo>> {
    return this.http.get<Array<Todo>>(`${this.api}/todos/search/${searchTerm}`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }

  getUserIds():Observable<number[]> {
    return this.http.get<number[]>(`${this.api}/users/ids`)
      .pipe(retry(3)).pipe(catchError(this.errorHandler));
  }
}
