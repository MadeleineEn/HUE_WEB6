import { Component, Input } from '@angular/core';
import {User} from "../shared/user";

@Component({
  selector: 'a.kwm-user-list-item',
  standalone: true,
  imports: [],
  templateUrl: './user-list-item.component.html',
})
export class UserListItemComponent {
  @Input() user: User | undefined;
}
