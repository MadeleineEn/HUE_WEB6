import {AbstractControl, FormControl, ValidatorFn} from "@angular/forms";

export class UrlValidator {
  static urlFormat: ValidatorFn = (control: AbstractControl): any => {
    if (!control.value) {
      return null;
    }
    // Einfache URL-Überprüfung mit regulärem Ausdruck
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlPattern.test(control.value) ? null : { urlFormat: { valid: false } };
  }
}
