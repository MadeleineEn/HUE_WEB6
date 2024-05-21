import { Routes } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { NoteListComponent } from "./note-list/note-list.component";
import { NoteDetailsComponent } from "./note-details/note-details.component";
import {LabelListComponent} from "./label-list/label-list.component";
import {LabelDetailsComponent} from "./label-details/label-details.component";
import {RegisterListComponent} from "./register-list/register-list.component";
import {TodoListComponent} from "./todo-list/todo-list.component";
import {TodoDetailsComponent} from "./todo-details/todo-details.component";
import {RegisterDetailsComponent} from "./register-details/register-details.component";
import {NoteFormComponent} from "./note-form/note-form.component";
import {UserListComponent} from "./user-list/user-list.component";
import {UserDetailsComponent} from "./user-details/user-details.component";
import {LoginComponent} from "./login/login.component";
import {canNavigateToAdminGuard} from "./can-navigate-to-admin.guard";
import {LabelFormComponent} from "./label-form/label-form.component";
import {RegisterFormComponent} from "./register-form/register-form.component";
import {TodoFormComponent} from "./todo-form/todo-form.component";

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'notes', component: NoteListComponent },
  { path: 'notes/:id', component: NoteDetailsComponent },
  { path: 'noteadmin', component: NoteFormComponent,canActivate:[canNavigateToAdminGuard] },
  { path: 'noteadmin/:id', component: NoteFormComponent,canActivate:[canNavigateToAdminGuard] },
  { path: 'labels', component: LabelListComponent},
  { path: 'labels/:id', component: LabelDetailsComponent},
  { path: 'labeladmin', component: LabelFormComponent,canActivate:[canNavigateToAdminGuard] },
  { path: 'labeladmin/:id', component: LabelFormComponent,canActivate:[canNavigateToAdminGuard] },
  { path: 'registers', component: RegisterListComponent},
  { path: 'registers/:id', component: RegisterDetailsComponent},
  { path: 'registeradmin', component: RegisterFormComponent,canActivate:[canNavigateToAdminGuard] },
  { path: 'registeradmin/:id', component: RegisterFormComponent,canActivate:[canNavigateToAdminGuard] },
  { path: 'todos', component: TodoListComponent},
  { path: 'todos/:id', component: TodoDetailsComponent},
  { path: 'todoadmin', component: TodoFormComponent,canActivate:[canNavigateToAdminGuard] },
  { path: 'todoadmin/:id', component: TodoFormComponent,canActivate:[canNavigateToAdminGuard] },
  { path: 'users', component: UserListComponent},
  { path: 'users/:id', component: UserDetailsComponent},
  { path: 'login', component: LoginComponent}
];
