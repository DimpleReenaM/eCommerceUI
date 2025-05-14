import { Injectable } from '@angular/core';
import { MyCategory } from '../Models/MyCategory';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MycategoryService {
  private baseUrl = 'https://localhost:7174/api/Catalog/category/getall'; // Update with your API URL

  constructor(private http: HttpClient) {}

  getCategories(): Observable<MyCategory[]> {
    return this.http.get<{ isSuccessed: boolean; data: MyCategory[] }>(`${this.baseUrl}`)
      .pipe(map(response => response.data)); // ✅ Extract 'data' like in getBrands()
  }
}
