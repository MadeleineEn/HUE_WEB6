import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {SearchComponent} from "../search/search.component";
import {Label} from "../shared/label";

@Component({
  selector: 'kwm-home',
  standalone: true,
  imports: [
    RouterLink,
    SearchComponent
  ],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {
  constructor(private router: Router,
              private route: ActivatedRoute) {  }

  labelSelected(label: Label){
    this.router.navigate(['../labels', label.id],
      {relativeTo: this.route});
  }
}
