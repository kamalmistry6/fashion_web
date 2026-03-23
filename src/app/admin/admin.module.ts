import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { ProductComponent } from './product/product.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ProductComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
