import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';

import { ProductComponent } from './product/product.component';
import { AddProductComponent } from './product/add-product/add-product.component';
import { CategoryComponent } from './category/category.component';
import { AddCategoryComponent } from './category/add-category/add-category.component';
import { MaterialComponent } from './material/material.component';
import { AddMaterialComponent } from './material/add-material/add-material.component';

@NgModule({
  declarations: [
    ProductComponent,
    AddProductComponent,
    CategoryComponent,
    AddCategoryComponent,
    MaterialComponent,
    AddMaterialComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class AdminModule {}