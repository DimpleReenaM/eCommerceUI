import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { MyProduct } from '../Models/MyProduct';
import { RegisterSellerDto } from '../Models/RegisterSellerDto';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyproductService {

  private baseUrl = 'https://localhost:7174/api/Catalog'; // Updated base URL

  constructor(private http: HttpClient) { }

  // Add a new product
  addProduct(product: FormData): Observable<MyProduct> {
    return this.http.post<MyProduct>(`${this.baseUrl}/product/create`, product);
  }

  getMyProducts(userId: number): Observable<MyProduct[]> { 
    return this.http.get<MyProduct[]>(`${this.baseUrl}/product/myprodcts/${userId}`);
  }

  // updateProduct(formData: FormData): Observable<any> {
  //   return this.http.put(`${this.baseUrl}/product`, formData);
  // }
  
  // Delete Product
  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/product/delete/${productId}`);
  }
  
  // Get Product by ID
  getProductById(productId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/product/${productId}`);
  }



   registerSeller(data: RegisterSellerDto) {
      return this.http.post(`${this.baseUrl}`, data);
    }
  
    // Assuming the API returns an object with a "data" field containing the array
  getSellerProducts(userId: number): Observable<MyProduct[]> {
    return this.http.get<{ data: MyProduct[] }>(`${this.baseUrl}?userId=${userId}`)
      .pipe(
        map(response => response.data) // Extract the products array from the "data" field
      );
  }

  
  updateProduct(formData: FormData): Observable<any> {
    console.log(formData)
    return this.http.put(`${this.baseUrl}/product/update`, formData);
  }
  
 



}
