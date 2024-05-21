import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Label} from "../shared/label";
import {LabelFactory} from "../shared/label-factory";
import {KwmEvernoteService} from "../shared/kwm-evernote.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {User} from "../shared/user";
import {catchError, of} from "rxjs";
import {LabelFormErrorMessages} from "./label-form-error-messages";
import {AuthenticationService} from "../shared/authentication.service";
@Component({
  selector: 'kwm-label-form',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './label-form.component.html',
  styles: ``
})
export class LabelFormComponent implements OnInit{
  labelForm: FormGroup;
  label = LabelFactory.empty();
  isUpdatingLabel = false;
  users: User[] = [];
  errors: { [key: string]: string  } = {};
  isAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private kwm: KwmEvernoteService,
    private route: ActivatedRoute,
    public authService: AuthenticationService,
    private router: Router
  ){
    this.labelForm = this.fb.group({});
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if(id) {
      //ein aktuelller Tag wird geändert/upgedated
      this.isUpdatingLabel = true;
      this.kwm.getSingleLabel(id).subscribe(label => {
        this.label = label;
        this.initLabel();
      });
    }
    this.initLabel();
    this.loadUsers();
    this.checkAdmin();
  }

  initLabel(){
    this.labelForm = this.fb.group({
      id: this.label.id,
      title: [this.label.title, Validators.required],
      user_id: [this.label.user_id, Validators.required]
    });
    this.labelForm.statusChanges.subscribe(() =>
      this.updateErrorMessages());
  }

  loadUsers(){
    this.kwm.getAllUser()
      .pipe(catchError(error => {
          console.error('Fehler beim Laden der Benutzer', error);
          return of([]); // Rückgabe eines leeren Arrays im Fehlerfall
        })
      )
      .subscribe(users => {
        this.users = users;
      });
  }

  submitForm() {
    const label: Label = LabelFactory.fromObject(this.labelForm.value);

    label.users = this.label.users;
    if (this.isUpdatingLabel) {
      this.kwm.updateLabel(label).subscribe(res => {
        this.router.navigate(["../../labels", label.id], {
          relativeTo: this.route
        });
      });
    } else {
      this.kwm.createLabel(label).subscribe(res => {
        this.label = LabelFactory.empty();
        this.labelForm.reset(LabelFactory.empty());
        this.router.navigate(["../labels"], { relativeTo: this.route });
      });
    }
  }

  updateErrorMessages(){
    this.errors = {};
    for (const message of LabelFormErrorMessages) {
      const control = this.labelForm.get(message.forControl);
      if (
        control &&
        control.dirty &&
        control.invalid && control.errors &&
        control.errors[message.forValidator] &&
        !this.errors[message.forControl]
      ) {
        this.errors[message.forControl] = message.text;
      }
    }
  }

  checkAdmin(){
    // Überprüfen, ob der Benutzer Admin ist
    this.authService.isAdmin().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }
}
