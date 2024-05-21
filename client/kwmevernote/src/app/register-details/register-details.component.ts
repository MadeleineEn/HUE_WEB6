import {Component, OnInit} from '@angular/core';
import { Register } from "../shared/register";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {DatePipe} from "@angular/common";
import {RegisterFactory} from "../shared/register-factory";
import {KwmEvernoteService} from "../shared/kwm-evernote.service";
import {AuthenticationService} from "../shared/authentication.service";

@Component({
  selector: 'kwm-register-details',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe
  ],
  templateUrl: './register-details.component.html',
  styles: ``
})
export class RegisterDetailsComponent implements OnInit{
  register: Register = RegisterFactory.empty();
  isAdmin: boolean = false;

  constructor(
    private kwm: KwmEvernoteService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthenticationService
  ){ }

  ngOnInit() {
    const params = this.route.snapshot.params;

    this.kwm.getSingleRegister(params['id'])
      .subscribe((r:Register) => {
        this.register = r;
        console.log(this.register.title);
      });

    this.checkAdmin();
  }

  removeRegister() {
    if (confirm('Liste wirklich löschen?')) {
      this.kwm.removeRegister(this.register.id)
        .subscribe((res:any) => this.router.navigate(['../'], { relativeTo:
          this.route }));
    }
  }

  checkAdmin(){
    this.authService.isAdmin().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }
}
