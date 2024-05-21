import { Component, OnInit } from '@angular/core';
import {Todo} from "../shared/todo";
import {KwmEvernoteService} from "../shared/kwm-evernote.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {TodoFactory} from "../shared/todo-factory";
import {DatePipe} from "@angular/common";
import {Note} from "../shared/note";
import {AuthenticationService} from "../shared/authentication.service";

@Component({
  selector: 'kwm-todo-details',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe
  ],
  templateUrl: './todo-details.component.html',
})
export class TodoDetailsComponent implements OnInit{
  todo: Todo = TodoFactory.empty();
  isAdmin: boolean = false;

  constructor(
    private kwm: KwmEvernoteService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthenticationService
  ){}

  ngOnInit() {
    const params = this.route.snapshot.params;

    this.kwm.getSingleTodo(params['id'])
      .subscribe((t: Todo) => {
        this.todo = t;
      });

    this.checkAdmin()
  }

  removeTodo(){
    if (confirm('Todo wirklich löschen?')) {
      this.kwm.removeTodo(this.todo.id)
        .subscribe((res:any) => this.router.navigate(['../'], { relativeTo:
          this.route }));
    }
  }

  checkAdmin(){
    this.authService.isAdmin().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }
}
