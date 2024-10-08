import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-loader',
  templateUrl: './custom-loader.component.html',
  styleUrls: ['./custom-loader.component.scss'],
})
export class CustomLoaderComponent {
  @Input() isLoading = false;


}
