import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'splash',
    loadChildren: () =>
      import('./splash/splash.module').then((m) => m.SplashPageModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'product-description/:id',
    loadChildren: () => import('./product-description/product-description.module').then(m => m.ProductDescriptionPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'logintype',
    loadChildren: () => import('./logintype/logintype.module').then(m => m.LogintypePageModule)
  },
  {
    path: 'shipping-info',
    loadChildren: () => import('./shipping-info/shipping-info.module').then(m => m.ShippingInfoPageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then(m => m.SplashPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./orders/orders.module').then(m => m.OrdersPageModule),
    'canActivate': [AuthGuard]
  },
  {
    path: 'homepage-2',
    loadChildren: () => import('./homepage-2/homepage-2.module').then( m => m.Homepage2PageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'success',
    loadChildren: () => import('./success/success.module').then( m => m.SuccessPageModule)
  },
  {
    path: 'guest',
    loadChildren: () => import('./guest/guest.module').then( m => m.GuestPageModule)
  },
  {
    path: 'paynow',
    loadChildren: () => import('./embedded-payment/embedded-payment.module').then( m => m.EmbeddedPaymentPageModule)
  },
  // {
  //   path: 'tabs/settings',
  //   loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  // },
 

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
