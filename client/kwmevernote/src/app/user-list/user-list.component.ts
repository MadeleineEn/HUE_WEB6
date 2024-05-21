import { Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {KwmEvernoteService} from "../shared/kwm-evernote.service";
import {User} from "../shared/user";
import {UserListItemComponent} from "../user-list-item/user-list-item.component";

@Component({
  selector: 'kwm-user-list',
  standalone: true,
  imports: [
    RouterLink,
    UserListItemComponent
  ],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private kwm: KwmEvernoteService) {  }
  ngOnInit() {
    this.kwm.getAllUser().subscribe(res => this.users = res);
  }
}
