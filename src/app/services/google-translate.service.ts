import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Servicio para traducir texto utilizando la API de Google Translate.
 * Permite traducir textos a diferentes idiomas mediante una solicitud HTTP.
 */
@Injectable({
  providedIn: 'root', // Hace que el servicio esté disponible en toda la aplicación
})
export class GoogleTranslateService {

  private apiKey = 'TU_API_KEY_AQUI';  // 🔹 Reemplázalo con tu clave de API de Google Translate

  private url = 'https://translation.googleapis.com/language/translate/v2'; // 🔹 URL base de la API de traducción

  constructor(private http: HttpClient) {} // 🔹 Inyección de HttpClient para realizar peticiones HTTP

  /**
   * Traduce un texto al idioma especificado.
   * @param text - Texto que se desea traducir.
   * @param targetLang - Idioma de destino (por defecto es 'es' - español).
   * @returns Observable con la respuesta de la API de Google Translate.
   */
  translateText(text: string, targetLang: string = 'es'): Observable<any> {
    const body = {
      q: text, // 🔹 Texto que será traducido
      target: targetLang, // 🔹 Idioma de destino
      format: 'text', // 🔹 Define que el formato es texto plano
      key: this.apiKey, // 🔹 API Key para autenticar la solicitud
    };

    return this.http.post(this.url, body); // 🔹 Realiza la petición HTTP POST a la API de Google Translate
  }
}
