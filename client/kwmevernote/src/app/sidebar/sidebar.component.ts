import { Component } from '@angular/core';
import {RouterLinkActive} from "@angular/router";

@Component({
  selector: 'kwm-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [
    RouterLinkActive
  ],
  standalone: true
})
export class SidebarComponent {
}
