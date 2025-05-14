import { Component } from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: false
})
export class ModalComponent {
  registerForm: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private toastController: ToastController
  ) {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async register() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      
      try {
        await this.authService.register(email, password);
        this.toastWelcome('top');
        this.dismiss();
      } catch (error) {
        this.toastError('top');
      }
    }
  }

  toastError(position: 'top' | 'middle' | 'bottom') {
    this.toastController.create({
      message: 'Error al registrar usuario',
      duration: 2500,
      position: position
    }).then((toast: any) => toast.present());
  }

  toastWelcome(position: 'top' | 'middle' | 'bottom') {
    this.toastController.create({
      message: `Registro exitoso ${this.registerForm.value.email} `,
      duration: 2500,
      position: position
    }).then((toast: any) => toast.present());
  }
} 