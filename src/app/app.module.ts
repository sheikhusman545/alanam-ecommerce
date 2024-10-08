import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CartCountComponent } from './components/cart-count/cart-count.component';
import { CustomLoaderComponent } from './custom-loader/custom-loader.component';

@NgModule({
  declarations: [AppComponent, CartCountComponent,CustomLoaderComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
  exports: [CartCountComponent,CustomLoaderComponent]
})
export class AppModule {}
