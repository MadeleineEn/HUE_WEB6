import { Component, OnInit } from '@angular/core';
import {Label} from "../shared/label";
import {KwmEvernoteService} from "../shared/kwm-evernote.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {LabelFactory} from "../shared/label-factory";
import {DatePipe} from "@angular/common";
import {Todo, User} from "../shared/user";
import {catchError, of} from "rxjs";
import {AuthenticationService} from "../shared/authentication.service";

@Component({
  selector: 'kwm-label-details',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe
  ],
  templateUrl: './label-details.component.html',
})
export class LabelDetailsComponent implements OnInit{
  label: Label = LabelFactory.empty();
  users: User[] = [];
  isAdmin: boolean = false;

  constructor(
    private kwm: KwmEvernoteService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthenticationService
  ){}

  ngOnInit() {
    const params = this.route.snapshot.params;
    this.kwm.getSingleLabel(params['id'])
      .subscribe((l:Label) => this.label = l);

    this.checkAdmin();
  }

  removeLabel(){
    if(confirm('Tag wirklich löschen?')) {
      this.kwm.removeLabel(this.label.id)
        .subscribe((res:any) => this.router.navigate(['../'], { relativeTo:
          this.route }));
    }
  }

  // Überprüfen, ob der Benutzer Admin ist
  checkAdmin(){
    this.authService.isAdmin().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }
}
