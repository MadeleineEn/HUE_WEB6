import { Component, OnInit } from '@angular/core';
import {LabelListItemComponent} from "../label-list-item/label-list-item.component";
import {RouterLink} from "@angular/router";
import {Label} from "../shared/label";
import {KwmEvernoteService} from "../shared/kwm-evernote.service";
import {SearchComponent} from "../search/search.component";

@Component({
  selector: 'kwm-label-list',
  standalone: true,
    imports: [
        LabelListItemComponent,
        RouterLink,
        SearchComponent
    ],
  templateUrl: './label-list.component.html',
  styles: ``
})
export class LabelListComponent implements OnInit{
  labels: Label [] = [];

  constructor(private kwm: KwmEvernoteService) {  }

  ngOnInit() {
    this.kwm.getAllLabels().subscribe(res => this.labels = res);
  }
}
