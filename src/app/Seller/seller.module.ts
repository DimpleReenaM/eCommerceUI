import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellerRoutingModule } from './seller-routing.module';
import { AppRoutingModule } from '../app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddProductComponent } from './add-product/add-product.component';
import { RegisterComponent } from './register/register.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SellerRoutingModule,
  ]
})
export class SellerModule { }
