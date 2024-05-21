import { Component, Input } from '@angular/core';
import {Todo} from "../shared/note";

@Component({
  selector: 'a.kwm-todo-list-item',
  standalone: true,
  imports: [],
  templateUrl: './todo-list-item.component.html',
})
export class TodoListItemComponent {
  @Input() todo: Todo | undefined;
}
