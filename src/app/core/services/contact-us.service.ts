import { inject, Injectable } from "@angular/core";
import { environments } from "../../environments/environments";
import { ContactUs } from "../../shared/models/contact-us";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EmailResponse } from "../../shared/models/email.model";

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  private contactUsUrl: string = environments.baseContactUsUrl;

  private http = inject( HttpClient );

  sendEmail(emailRequest: any): Observable<EmailResponse> {
    return this.http.post<EmailResponse>(this.contactUsUrl, emailRequest, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
