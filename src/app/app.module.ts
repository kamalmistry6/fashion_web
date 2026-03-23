import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { SidenavComponent } from './shared/sidenav/sidenav.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    UserLayoutComponent,
    SidenavComponent,
    NavbarComponent,
  ],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, SharedModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
