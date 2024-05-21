import {Component, OnInit} from '@angular/core';
import {Note} from "../shared/note";
import {NoteListItemComponent} from "../note-list-item/note-list-item.component";
import {RouterLink} from "@angular/router";
import {KwmEvernoteService} from "../shared/kwm-evernote.service";

@Component({
  selector: 'kwm-note-list',
  standalone: true,
  imports: [
    NoteListItemComponent,
    RouterLink
  ],
  templateUrl: './note-list.component.html',
})
export class NoteListComponent implements OnInit{
  notes: Note[] = [];

  constructor(private kwm: KwmEvernoteService) {  }
  ngOnInit() {
    this.kwm.getAllNotes().subscribe(res => this.notes = res);
  }

}
