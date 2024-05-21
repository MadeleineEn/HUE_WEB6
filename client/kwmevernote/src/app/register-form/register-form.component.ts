import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Register} from "../shared/register";
import {RegisterFactory} from "../shared/register-factory";
import {KwmEvernoteService} from "../shared/kwm-evernote.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {catchError, of} from "rxjs";
import {RegisterFormErrorMessages} from "./register-form-error-messages";
import {AuthenticationService} from "../shared/authentication.service";

@Component({
  selector: 'kwm-register-form',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './register-form.component.html',
  styles: ``
})
export class RegisterFormComponent implements OnInit{
  registerForm: FormGroup;
  register= RegisterFactory.empty();
  isUpdatingRegister = false;
  errors: { [key: string]: string  } = {};
  isAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private kwm: KwmEvernoteService,
    public authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ){
    this.registerForm = this.fb.group({});
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if(id) {
      this.isUpdatingRegister = true;
      this.kwm.getSingleRegister(id).subscribe(register => {
        this.register = register;
        this.initRegister();
      });
    }
    this.initRegister();
    this.checkAdmin();
  }

  initRegister(){
    this.registerForm = this.fb.group({
      id: this.register.id,
      title: [this.register.title, Validators.required],
      is_public: [this.register.is_public, Validators.required]});
    this.registerForm.statusChanges.subscribe(() =>
      this.updateErrorMessages());
  }

  submitForm() {
    const formValues = this.registerForm.value;
    const register: Register = RegisterFactory.fromObject(this.registerForm.value);

    if (this.isUpdatingRegister) {
      this.kwm.updateRegister(register).subscribe(res => {
        this.router.navigate(["../../registers", register.id], {
          relativeTo: this.route
        });
      });
    } else {
      this.kwm.createRegister(register).subscribe(res => {
        this.register = RegisterFactory.empty();
        this.registerForm.reset(RegisterFactory.empty());
        this.router.navigate(["../registers"], { relativeTo: this.route });
      });
    }
  }

  updateErrorMessages(){
    this.errors = {};
    for (const message of RegisterFormErrorMessages) {
      const control = this.registerForm.get(message.forControl);
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
