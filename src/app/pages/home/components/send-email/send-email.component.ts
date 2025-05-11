import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactUsService } from '../../../../core/services/contact-us.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'send-email-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css']
})
export default class SendEmailComponent implements OnInit {
  contactForm!: FormGroup;

  private contactUsService = inject(ContactUsService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.contactForm = this.formBuilder.group({
      senderName: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      emailMessage: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Formulario válido, enviando datos...');

      const emailRequest = {
        senderName: this.contactForm.get('senderName')?.value,
        phoneNumber: this.contactForm.get('phoneNumber')?.value,
        gender: this.contactForm.get('gender')?.value,
        emailMessage: this.contactForm.get('emailMessage')?.value
      };

      this.contactUsService.sendEmail(emailRequest).subscribe({
        next: (response) => {
          console.log('Correo enviado con éxito:', response);
          alert('Correo enviado con éxito');
          this.router.navigateByUrl('/home');
        },
        error: (error) => {
          console.error('Error al enviar el correo:', error);
          alert('Error al enviar el correo. Verifica la consola para más detalles.');
        },
        complete: () => {
          console.log('Petición completada');
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }



}
