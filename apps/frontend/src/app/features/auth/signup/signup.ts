import { Component, inject, signal } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { TuyauHTTPError } from '@tuyau/core/client'
import { AuthService } from '../../../core/auth/auth.service'

/**
 * Validates against the sibling "password" control, so it must be
 * used inside a group that has one.
 */
function matchPassword(control: AbstractControl): ValidationErrors | null {
  const password = control.parent?.get('password')?.value
  return password && control.value !== password ? { passwordsMismatch: true } : null
}

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private fb = inject(NonNullableFormBuilder)
  private auth = inject(AuthService)
  private router = inject(Router)

  submitting = signal(false)
  errorMessage = signal<string | null>(null)

  form = this.fb.group({
    fullName: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
    passwordConfirmation: ['', [Validators.required, matchPassword]],
  })

  constructor() {
    this.form.controls.password.valueChanges.subscribe(() => {
      this.form.controls.passwordConfirmation.updateValueAndValidity()
    })
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    this.submitting.set(true)
    this.errorMessage.set(null)

    try {
      const { fullName, email, password, passwordConfirmation } = this.form.getRawValue()
      await this.auth.signup({ fullName: fullName || null, email, password, passwordConfirmation })
      this.router.navigateByUrl('/')
    } catch (error) {
      if (error instanceof TuyauHTTPError && error.status === 422) {
        const { errors = [] } = error.response as {
          errors?: { field: string; message: string }[]
        }
        for (const { field, message } of errors) {
          this.form.get(field)?.setErrors({ server: message })
        }
      } else {
        this.errorMessage.set('Something went wrong. Please try again.')
      }
    } finally {
      this.submitting.set(false)
    }
  }
}
