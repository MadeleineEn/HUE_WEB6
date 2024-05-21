import {Component, OnInit} from '@angular/core';
import {Todo} from "../shared/todo";
import {TodoListItemComponent} from "../todo-list-item/todo-list-item.component";
import {RouterLink} from "@angular/router";
import {KwmEvernoteService} from "../shared/kwm-evernote.service";
import {NoteListItemComponent} from "../note-list-item/note-list-item.component";

@Component({
  selector: 'kwm-todo-list',
  standalone: true,
  imports: [
    TodoListItemComponent,
    RouterLink,
    NoteListItemComponent
  ],
  templateUrl: './todo-list.component.html',
})
export class TodoListComponent implements OnInit{
  todos: Todo[] = [];

  constructor(private kwm: KwmEvernoteService) { }

  ngOnInit() {
    this.kwm.getAllTodos().subscribe(res => this.todos = res);
  }
}
