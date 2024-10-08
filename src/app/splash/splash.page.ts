// import { Component, OnInit } from '@angular/core';
// import { NavController } from '@ionic/angular';
// import { Platform } from '@ionic/angular';
// @Component({
//   selector: 'app-splash',
//   templateUrl: './splash.page.html',
//   styleUrls: ['./splash.page.scss'],
// })
// export class SplashPage implements OnInit {

//   constructor(private navCtrl: NavController,
//     private platform: Platform

//   ) { }

//   ngOnInit(): void {
//     const image = document.getElementById('splashImage') as HTMLImageElement;
//     const audio = document.getElementById('splashAudio') as HTMLAudioElement;

//     // Display the image
//     image.style.display = 'block';

//     // Hide the image after a certain time and then show the audio
//     setTimeout(() => {
//       audio.style.display = 'block';

//       // Attempt to play audio with muted to avoid autoplay restrictions
//       audio.muted = false; // Try to autoplay muted audio
//       audio.play().catch(error => {
//         console.log('Autoplay was prevented:', error);
//       });

//       audio.onended = () => {
//         console.log('Video ended. Navigating to home...');
//         // this.navCtrl.navigateRoot('tabs/home').then(() => {
//         //   console.log('Navigation to home successful');
//         // }).catch(err => {
//         //   console.error('Navigation error:', err);
//         // });
//       };
//     }, 4000); // Adjust the time as needed (e.g., 3000 ms = 3 seconds)
//   }
//   }

//   ngOnInit() {
//     // Play the audio when the splash screen loads
//     this.platform.ready().then(() => {
//       this.playAudio();
//     }); 
//     // Navigate to the homepage after 4 seconds
//     setTimeout(() => {
//       // this.playAudio();

//       this.navCtrl.navigateRoot('tabs/home');
//     }, 4000);
//   }

//   playAudio() {
//     const audio = new Audio('assets/images/allah_akbar.mp3');

//     // Enable autoplay programmatically
//     audio.autoplay = true;

//     // Catch any errors if playback fails
//     audio.play().catch(error => {
//       console.error('Error playing audio', error);
//     });
//   }



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
      console.log('Audio playback failed:', error);
    }
    setTimeout(() => {

      this.navCtrl.navigateRoot('tabs/home');
    }, 6000);
  }

}
