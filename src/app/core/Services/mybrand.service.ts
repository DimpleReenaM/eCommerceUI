import { Injectable } from '@angular/core';
import { MyBrand } from '../Models/MyBrand';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MybrandService {

  private baseUrl = 'https://localhost:7174/api/Catalog/brand/getall'; // Update with your API URL

  constructor(private http: HttpClient) {}

  getBrands(): Observable<MyBrand[]> {
    return this.http.get<{ isSuccessed: boolean; data: MyBrand[] }>('https://localhost:7174/api/Catalog/brand/getall')
      .pipe(map(response => response.data)); // ✅ Extract 'data'
  }
}
