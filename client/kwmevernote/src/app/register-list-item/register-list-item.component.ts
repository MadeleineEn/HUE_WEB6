import { Component, Input } from '@angular/core';
import { Register } from "../shared/register";

@Component({
  selector: 'a.kwm-register-list-item',
  standalone: true,
  imports: [],
  templateUrl: './register-list-item.component.html',
  styles: ``
})
export class RegisterListItemComponent {
  @Input() register: Register | undefined;

}
