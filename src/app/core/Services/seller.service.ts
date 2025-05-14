import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterSellerDto } from '../Models/RegisterSellerDto';
import { map, Observable } from 'rxjs';
import { MyProduct } from '../Models/MyProduct';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private apiUrl = 'https://localhost:7174/api/Catalog/seller-products'; // Change base URL as needed


  constructor(private http:HttpClient) { }
  registerSeller(data: RegisterSellerDto) {
    return this.http.post(`https://localhost:7174/api/auth/register-seller`, data);
  }

  // Assuming the API returns an object with a "data" field containing the array
getSellerProducts(userId: number): Observable<MyProduct[]> {
  return this.http.get<{ data: MyProduct[] }>(`${this.apiUrl}?userId=${userId}`)
    .pipe(
      map(response => response.data) // Extract the products array from the "data" field
    );
}
  
  
  addProduct(product: MyProduct): Observable<MyProduct> {
    return this.http.post<MyProduct>(this.apiUrl, product);
  }

  updateProduct(id: number, product: MyProduct): Observable<MyProduct> {
    return this.http.put<MyProduct>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
