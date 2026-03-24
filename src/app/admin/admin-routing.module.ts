import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { AddProductComponent } from './product/add-product/add-product.component';
import { CategoryComponent } from './category/category.component';
import { AddCategoryComponent } from './category/add-category/add-category.component';
import { MaterialComponent } from './material/material.component';
import { AddMaterialComponent } from './material/add-material/add-material.component';

const routes: Routes = [
  { path: 'products', component: ProductComponent },
  { path: 'products/add', component: AddProductComponent },
  { path: 'products/edit/:slug', component: AddProductComponent },

  { path: 'categories', component: CategoryComponent },
  { path: 'categories/add', component: AddCategoryComponent },
  { path: 'categories/edit/:id', component: AddCategoryComponent },

  { path: 'materials', component: MaterialComponent },
  { path: 'materials/add', component: AddMaterialComponent },
  { path: 'materials/edit/:id', component: AddMaterialComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}