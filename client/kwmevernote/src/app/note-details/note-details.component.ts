import {Component, OnInit} from '@angular/core';
import {Note, User} from "../shared/note";
import {KwmEvernoteService} from "../shared/kwm-evernote.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {NoteFactory} from "../shared/note-factory";
import {DatePipe} from "@angular/common";
import {AuthenticationService} from "../shared/authentication.service";
import {catchError, of} from "rxjs";

@Component({
  selector: 'kwm-note-details',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe
  ],
  templateUrl: './note-details.component.html',
})
export class NoteDetailsComponent implements OnInit{
  note: Note = NoteFactory.empty();
  isAdmin: boolean = false;

  constructor(
    private kwm: KwmEvernoteService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthenticationService
  ) { }
  ngOnInit() {
    const params = this.route.snapshot.params;

    this.kwm.getSingleNote(params['id'])
      .subscribe((n:Note) => {
        this.note = n;
      });

    this.checkAdmin()
  }

  removeNote() {
    if (confirm('Notiz wirklich löschen?')) {
      this.kwm.removeNote(this.note.id)
        .subscribe((res:any) => this.router.navigate(['../'], { relativeTo:
          this.route }));
    }
  }

  checkAdmin(){
    // Überprüfen, ob der Benutzer Admin ist
    this.authService.isAdmin().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }
}
