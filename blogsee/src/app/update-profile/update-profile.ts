import { Component } from '@angular/core';
import { Location } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './update-profile.html',
  styleUrl: './update-profile.css'
})
export class UpdateProfile {

  username = 'Tamanna';
  email = 'tamanna@example.com';
  credits = 95;

  changeUsername() {
    console.log('Change username clicked');
  }

  showPasswordOverlay = false;

  passwordForm: FormGroup;

  constructor(
    private location: Location,
    private fb: FormBuilder
  ) {

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],

      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ],

      confirmPassword: [
        '',
        Validators.required
      ]
    });
  }


  // Open password overlay
  changePassword() {
    this.showPasswordOverlay = true;
  }


  // Close password overlay
  closePasswordOverlay() {
    this.showPasswordOverlay = false;

    this.passwordForm.reset();
  }


  // Check whether old and new passwords are the same
  get passwordsAreSame(): boolean {
    const oldPassword =
      this.passwordForm.get('oldPassword')?.value;

    const newPassword =
      this.passwordForm.get('newPassword')?.value;

    return (
      oldPassword !== '' &&
      newPassword !== '' &&
      oldPassword === newPassword
    );
  }


  // Check whether new and confirm passwords are different
  get passwordsDoNotMatch(): boolean {
    const newPassword =
      this.passwordForm.get('newPassword')?.value;

    const confirmPassword =
      this.passwordForm.get('confirmPassword')?.value;

    return (
      confirmPassword !== '' &&
      newPassword !== confirmPassword
    );
  }


  // Save password
  savePassword() {

    // Mark all fields as touched
    this.passwordForm.markAllAsTouched();

    if (this.passwordForm.invalid) {
      return;
    }

    if (this.passwordsAreSame) {
      return;
    }

    if (this.passwordsDoNotMatch) {
      return;
    }

    console.log('Password changed successfully');

    this.closePasswordOverlay();
  }


  goBack() {
    this.location.back();
  }

}