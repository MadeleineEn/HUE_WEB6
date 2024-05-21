import {Component, Input} from '@angular/core';
import { Label } from "../shared/label";

@Component({
  selector: 'a.kwm-label-list-item',
  standalone: true,
  imports: [],
  templateUrl: './label-list-item.component.html',
})
export class LabelListItemComponent {
  @Input() label: Label | undefined;

}
