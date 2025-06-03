import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetUserOrdersDTO } from '../Models/userOrder';
import { OrderDetailDTO } from '../Models/order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http:HttpClient) { }

  getUserOrders(){
    return this.http.get<GetUserOrdersDTO[]>('Order/Get-all-orders')
  }

  getOrderDetail(orderId:number){
    return this.http.get<OrderDetailDTO>('Order/orderdetail/'+orderId)
  }
   cancelOrder(orderId: number, newStatus: string,userId:any): Observable<void> {
    const body = { orderId, newStatus ,userId};

    return this.http.put<void>(`Order/update-status`,body);
  }
}
