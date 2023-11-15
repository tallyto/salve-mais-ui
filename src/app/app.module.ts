import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MenuLateralComponent } from './components/menu-lateral/menu-lateral.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {RouterModule} from "@angular/router";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatMenuModule} from "@angular/material/menu";
import { CartaoFormComponent } from './components/cartao-form/cartao-form.component';
import {MatInputModule} from "@angular/material/input";
import { CategoriaFormComponent } from './components/categoria-form/categoria-form.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MenuLateralComponent,
    CartaoFormComponent,
    CategoriaFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    MatIconModule,
    MatExpansionModule,
    MatTooltipModule,
    AppRoutingModule,
    HttpClientModule,
    MatCardModule,
    MatTableModule,
    MatSidenavModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
