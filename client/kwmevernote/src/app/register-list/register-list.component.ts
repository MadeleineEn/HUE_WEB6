import {Component, OnInit} from '@angular/core';
import {RegisterListItemComponent} from "../register-list-item/register-list-item.component";
import {RouterLink} from "@angular/router";
import {Register} from "../shared/register";
import {KwmEvernoteService} from "../shared/kwm-evernote.service";

@Component({
  selector: 'kwm-register-list',
  standalone: true,
  imports: [
    RegisterListItemComponent,
    RouterLink
  ],
  templateUrl: './register-list.component.html',
})
export class RegisterListComponent implements OnInit {
  registers: Register [] = [];

  constructor(private kwm: KwmEvernoteService){  }

  ngOnInit() {
    this.kwm.getAllRegisters().subscribe
    (res => this.registers = res);
  }

}
