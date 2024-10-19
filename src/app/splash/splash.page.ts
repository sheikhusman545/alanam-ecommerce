import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  audio: HTMLAudioElement;

  constructor(private platform: Platform, private navCtrl: NavController
  ) {
    this.audio = new Audio('assets/images/start.mp3'); // Set the path to your audio file
  }

  async ngOnInit() {
    await this.platform.ready();

    // Try to play the audio
    try {
      await this.audio.play();
    } catch (error) {
    }
    setTimeout(() => {

      this.navCtrl.navigateRoot('tabs/home');
    }, 4000);
  }

}
