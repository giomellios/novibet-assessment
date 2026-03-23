import { Directive, forwardRef } from '@angular/core';
import { FormControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appSearchKeywordValidator]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SearchKeywordValidatorDirective),
      multi: true
    }
  ]
})
export class SearchKeywordValidatorDirective implements Validator {
  validate(control: FormControl): ValidationErrors | null {
    const value = `${control.value ?? ''}`.trim();

    if (!value) {
      return null;
    }

    const errors: ValidationErrors = {};

    if (value.length < 3) {
      errors['searchMinLength'] = { requiredLength: 3, actualLength: value.length };
    }

    if (!/^[a-z0-9\s]+$/i.test(value)) {
      errors['searchAlphanumeric'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  }

}
