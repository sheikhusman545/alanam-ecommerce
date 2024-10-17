import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service'; 
import { PopoverController } from '@ionic/angular'; 
@Component({
  selector: 'app-language-popover',
  templateUrl: './language-popover.component.html',
  styleUrls: ['./language-popover.component.scss'],
})
export class LanguagePopoverComponent  implements OnInit {
  currentLanguage: any;

  constructor(
    private languageService: LanguageService,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {}

  switchLanguage(language: string) {
    this.currentLanguage = this.languageService.switchLanguage(language);
    this.popoverController.dismiss(this.currentLanguage); // Dismisses popover with selected language data

  }
}
