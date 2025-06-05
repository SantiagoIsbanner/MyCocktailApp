import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoogleTranslateService {

  private apiKey = 'TU_API_KEY_AQUI';  // Reemplazá con tu API key real

  private url = 'https://translation.googleapis.com/language/translate/v2';

  constructor(private http: HttpClient) {}

  translateText(text: string, targetLang: string = 'es'): Observable<any> {
    const body = {
      q: text,
      target: targetLang,
      format: 'text',
      key: this.apiKey,
    };

    return this.http.post(this.url, body);
  }
}