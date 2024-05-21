import {Component, OnInit} from '@angular/core';
import {
  FormArray, FormBuilder, FormControl, FormGroup,
  ReactiveFormsModule, Validators
} from "@angular/forms";
import {NoteFactory} from "../shared/note-factory";
import {KwmEvernoteService} from "../shared/kwm-evernote.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Label, Note, Register, User} from "../shared/note";
import {NoteFormErrorMessages} from "./note-form-error-messages";
import {catchError, first, of} from "rxjs";
import {AuthenticationService} from "../shared/authentication.service";
import {UrlValidator} from "../shared/url-validator";

@Component({
  selector: 'kwm-note-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './note-form.component.html',
  styles: ``
})
export class NoteFormComponent implements OnInit {
  noteForm: FormGroup;
  note = NoteFactory.empty();
  errors: { [key: string]: string } = {};
  isUpdatingNote = false;
  images: FormArray;
  users: User[] = [];
  registers: Register[] = [];
  labels: Label[] = [];
  isAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private kwm: KwmEvernoteService,
    private route: ActivatedRoute,
    public authService: AuthenticationService,
    private router: Router) {
    this.noteForm = this.fb.group({});
    this.images = this.fb.array([]);
  }

  ngOnInit() {
    const id = this.route.snapshot.params["id"];

    if (id) {
      this.isUpdatingNote = true;
      this.kwm.getSingleNote(id).subscribe(note => {
        this.note = note;
        this.initNote();
      });
    }else{

    }
    this.initNote();
    this.loadUsers();
    this.loadRegisters();
    this.loadLabels();
    this.checkAdmin()
  }

  initNote() {
    this.buildThumbnailsArray();
    this.noteForm = this.fb.group({
      id: this.note.id,
      title: [this.note.title, Validators.required],
      description: this.note.description,
      user_id: [this.note.user_id, Validators.required],
      register_id: [this.note.register_id, Validators.required],
      labels: this.fb.array(this.note.labels ? this.note.labels.map(label => typeof label === 'object' ? label.id : label) : []),
      images: this.images
    });

    if(this.images.length === 0){
      this.addThumbnailControl();
    }

    this.noteForm.statusChanges.subscribe(() =>
      this.updateErrorMessages());
  }

  buildThumbnailsArray() {
    //Image-Array initialisieren auch wenn keine Bilder dabei sind
    this.images = this.fb.array([]);

    if (this.note.images) {
      for (let img of this.note.images) {
        let fg = this.fb.group({
          id: new FormControl(img.id),
          url: new FormControl(img.url),
          title: new FormControl(img.title)
        });
        this.images.push(fg);
      }
    }
  }

  addThumbnailControl() {
    this.images.push(this.fb.group({id: 0, url: null, title: null}));
  }

  loadUsers() {
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

  loadRegisters() {
    this.kwm.getAllRegisters()
      .pipe(catchError(error => {
          console.error('Fehler beim Laden der Listen', error);
          return of([]); // Rückgabe eines leeren Arrays im Fehlerfall
        })
      )
      .subscribe(registers => {
        this.registers = registers;
      });
  }

  loadLabels() {
    this.kwm.getAllLabels()
      .pipe(
        catchError(error => {
          console.error('Fehler beim Laden der Tags', error);
          return of([]); // Rückgabe eines leeren Arrays im Fehlerfall
        })
      )
      .subscribe(labels => {
        this.labels = labels;

        // Setze die ausgewählten Labels im FormArray
        if(this.note.labels){
          const selectedLabelIds = this.note.labels.map(label => label.id);
          this.noteForm.setControl('labels', this.fb.array(selectedLabelIds));
        }
      });
  }

  submitForm() {
      // leere Werte filtern
      this.noteForm.value.images = this.noteForm.value.images.filter(
        (thumbnail: { url: string; title: string;}) => thumbnail.url || thumbnail. title
      );
      const note: Note = NoteFactory.fromObject(this.noteForm.value);
      if (this.isUpdatingNote) {
        this.kwm.updateNote(note).subscribe(res => {
          this.router.navigate(["../../notes", note.id], {
            relativeTo: this.route
          });
        });
      } else {
        this.kwm.createNote(note).subscribe(res => {
          this.note = NoteFactory.empty();
          this.noteForm.reset(NoteFactory.empty());
          this.router.navigate(["../notes"], {relativeTo: this.route});
        });
      }
  }

  updateErrorMessages() {
    console.log("Is invalid? " + this.noteForm.invalid);
    this.errors = {};
    for (const message of NoteFormErrorMessages) {
      const control = this.noteForm.get(message.forControl);
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

  isSelected(labelId: number): boolean {
    const selectedLabels = this.noteForm.get('labels') as FormArray;
    return selectedLabels.value.includes(labelId);
  }

  checkAdmin(){
    // Überprüfen, ob der Benutzer Admin ist
    this.authService.isAdmin().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

}
