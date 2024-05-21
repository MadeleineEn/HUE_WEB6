import {Component, OnInit} from '@angular/core';
import {User} from "../shared/user";
import {KwmEvernoteService} from "../shared/kwm-evernote.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {UserFactory} from "../shared/user-factory";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'kwm-user-details',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe
  ],
  templateUrl: './user-details.component.html',
})
export class UserDetailsComponent implements OnInit{
  user: User = UserFactory.empty();

  constructor(
    private kwm: KwmEvernoteService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit() {
    const params = this.route.snapshot.params;

    this.kwm.getSingleUser(params['id'])
      .subscribe((u: User) => {
        this.user = u;
      });
  }

  /*removeUser() {
    if (confirm('Benutzer wirklich löschen?')) {
      this.kwm.removeUser(this.user.id)
        .subscribe((res:any) => this.router.navigate(['../'], { relativeTo:
          this.route }));
    }
  }*/
}
