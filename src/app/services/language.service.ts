import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private languageSubject = new BehaviorSubject<string>('en'); // Default language as 'en'
  language$ = this.languageSubject.asObservable(); // Observable for the current language

  constructor(private translate: TranslateService) {
    // Set default language
    this.translate.setDefaultLang('en');

    // Use language stored in localStorage or default to English
    const savedLang = localStorage.getItem('language') || 'en';
    this.switchLanguage(savedLang);
  }

  // Function to switch language and store the selection
  switchLanguage(language: string) {
    this.translate.use(language);
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    this.languageSubject.next(language); // Update the BehaviorSubject
  }

  // Get the current language
  getCurrentLanguage() {
    return this.languageSubject.value; // Return the current value of the BehaviorSubject
  }
}

// import { Injectable } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class LanguageService {
//   constructor(private translate: TranslateService) {
//     // Set default language
//     this.translate.setDefaultLang('en');
//     // Use language stored in localStorage or default to English
//     const savedLang = localStorage.getItem('language') || 'en';
//     this.switchLanguage(savedLang);
//   }

//   // Function to switch language and store the selection
//   switchLanguage(language: string) {
//     this.translate.use(language);
//     localStorage.setItem('language', language);
//     // Set direction for RTL languages like Arabic
//     document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
//     return language;
//   }

//   // Get the current language
//   getCurrentLanguage() {
//     return this.translate.currentLang;
//   }
// }
