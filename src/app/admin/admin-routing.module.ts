import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
  // { path: '', component: HomeComponent },

  { path: 'products', component: ProductComponent },

  // { path: 'products/:slug', component: ProductDetailComponent },

  // { path: 'search', component: SearchComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
