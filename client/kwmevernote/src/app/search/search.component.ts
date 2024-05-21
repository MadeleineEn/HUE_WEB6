import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { KwmEvernoteService } from '../shared/kwm-evernote.service';
import { Label } from '../shared/label';
import { NgClass } from '@angular/common';

@Component({
  selector: 'kwm-search',
  standalone: true,
  imports: [NgClass],
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
  keyup = new EventEmitter<string>();
  foundLabels: Label[] = [];
  isLoading = false;
  @Output() labelSelected = new EventEmitter<Label>();

  constructor(private bs: KwmEvernoteService) {}

  ngOnInit() {
    this.keyup
      .pipe(
        filter(term => term !== ""),
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => this.isLoading = true),
        switchMap(searchTerm => this.bs.getAllSearchLabel(searchTerm)),
        tap(() => this.isLoading = false)
      )
      .subscribe((labels) => {
        this.foundLabels = labels;
        console.log(labels);
      });
  }
}
