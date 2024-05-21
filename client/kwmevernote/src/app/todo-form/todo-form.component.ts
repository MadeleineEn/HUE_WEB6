import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Todo, User} from "../shared/user";
import {TodoFactory} from "../shared/todo-factory";
import {KwmEvernoteService} from "../shared/kwm-evernote.service";
import {TodoFormErrorMessages} from "./todo-form-error-messages";
import {Label, Note} from "../shared/note";
import {catchError, of} from "rxjs";
import {AuthenticationService} from "../shared/authentication.service";

@Component({
  selector: 'kwm-todo-form',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './todo-form.component.html',
  styles: ``
})
export class TodoFormComponent implements OnInit{
  todoForm: FormGroup;
  todo = TodoFactory.empty();
  isUpdatingTodo = false;
  existingUsers: User[] = [];
  users: FormArray;
  notes: Note[] = [];
  existingLabels: Label[] = [];
  labels: FormArray;
  images: FormArray;
  errors: { [key: string]: string  } = {};
  isAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private kwm: KwmEvernoteService,
    private route: ActivatedRoute,
    public authService: AuthenticationService,
    private router: Router
  ){
    this.todoForm = this.fb.group({});
    this.images = this.fb.array([]);
    this.labels = this.fb.array([]);
    this.users = this.fb.array([]);
  }


  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if(id) {
      this.isUpdatingTodo = true;
      this.kwm.getSingleTodo(id).subscribe(todo => {
        this.todo = todo;
        this.initTodo();
      });
    }
    this.loadLabels();
    this.loadNotes();
    this.loadUsers();
    this.initTodo();
    this.checkAdmin();
  }

  initTodo(){
    this.buildThumbnailsArray();
    this.buildLabelsArray();
    this.buildUsersArray();
    this.todoForm = this.fb.group({
      id: this.todo.id,
      title: [this.todo.title, Validators.required],
      description: [this.todo.description],
      due_date: [this.todo.due_date, Validators.required],
      is_public: [this.todo.is_public, Validators.required],
      images: this.images,
      note_id: this.todo.note_id,
      labels: this.labels,
      users: this.users
    });

    if(this.images.length === 0){
      this.addThumbnailControl();
    }

    this.todoForm.statusChanges.subscribe(() =>
      this.updateErrorMessages());
  }

  loadNotes(){
    this.kwm.getAllNotes()
      .pipe(catchError(error => {
          console.error('Fehler beim Laden der Notizen', error);
          return of([]); // Rückgabe eines leeren Arrays im Fehlerfall
        })
      )
      .subscribe(notes => {
        this.notes = notes;
      });
  }

  loadLabels(){
    this.kwm.getAllLabels()
      .pipe(catchError(error => {
          console.error('Fehler beim Laden der Tags', error);
          return of([]); // Rückgabe eines leeren Arrays im Fehlerfall
        })
      )
      .subscribe(labels => {
        this.existingLabels = labels;
      });
  }

  loadUsers(){
    this.kwm.getAllUser()
      .pipe(catchError(error => {
          console.error('Fehler beim Laden der Benutzer', error);
          return of([]); // Rückgabe eines leeren Arrays im Fehlerfall
        })
      )
      .subscribe(users => {
        this.existingUsers = users;
      });
  }

  private buildThumbnailsArray() {
    if(this.todo.images){
      this.images = this.fb.array([]);
      for(let img of this.todo.images){
        let fg = this.fb.group({
          id: this.fb.control(img.id),
          url: this.fb.control(img.url, Validators.required),
          title: this.fb.control(img.title, Validators.required)
        });
        this.images.push(fg);
      }
    }
  }

  private buildLabelsArray() {
    this.labels = this.fb.array([]);
    if(this.todo.labels){
      for(let lab of this.todo.labels){
        let fg = this.fb.group({
          id: this.fb.control(lab.id || ''),
          title: this.fb.control(lab.title, Validators.required),
          user_id: this.fb.control(lab.user_id, Validators.required)
        });
        this.labels.push(fg);
      }
    }
  }

  private buildUsersArray(){
    this.users = this.fb.array([]);
    if(this.todo.users){
      for(let usr of this.todo.users){
        let fg = this.fb.group({
          id: this.fb.control(usr.id || ''),
          username: this.fb.control(usr.username, Validators.required),
          firstname: this.fb.control(usr.firstname, Validators.required),
          lastname: this.fb.control(usr.lastname, Validators.required),
          email: this.fb.control(usr.email, Validators.required),
          email_verified_at: this.fb.control(usr.email_verified_at),
          password: this.fb.control(usr.password, Validators.required),
          role: this.fb.control(usr.role)
        });
        this.users.push(fg);
      }
    }
  }

  addThumbnailControl(){
    this.images.push(this.fb.group({id:0, url:null, title:null}));
  }

  submitForm() {
    const todo: Todo = TodoFactory.fromObject(this.todoForm.value);
    todo.notes = this.todo.notes;

    if (this.isUpdatingTodo) {
      this.kwm.updateTodo(todo).subscribe(res => {
        this.router.navigate(["../../todos", todo.id], {
          relativeTo: this.route
        });
      });
    } else {
      this.kwm.createTodo(todo).subscribe(res => {
        this.todo = TodoFactory.empty();
        this.todoForm.reset(TodoFactory.empty());
        this.router.navigate(["../todos"], { relativeTo: this.route });
      });
    }
  }

  updateErrorMessages(){
    this.errors = {};
    for (const message of TodoFormErrorMessages) {
      const control = this.todoForm.get(message.forControl);
      if (
        control &&
        control.dirty &&
        control.invalid && control.errors &&
        control.errors[message.forValidator] &&
        !this.errors[message.forControl]
      ) {
        this.errors[message.forControl] = message.text;
      }
    }
  }

  checkAdmin(){
    // Überprüfen, ob der Benutzer Admin ist
    this.authService.isAdmin().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }
}
