import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CatalogService } from '../core/Services/catalog.service';
import { ProductFilters, ProductResDto } from '../core/Models/catalog';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: ProductResDto[] = [];

  pageIndex: number = 0;
  pageSize: number = 10;
  firstTimeloaded = false;
  pageItems!: number;
  maxPrice!: number;
  minPrice!: number;

  constructor(private catalogService: CatalogService) { }

  ngOnInit(): void {
    this.filters$.subscribe((filter) => {
      this.catalogService.getProducts(filter).subscribe((res) => {
        console.log(res);
        if (res.data?.count !== undefined) {
          this.pageItems = res.data.count;
          this.catalogService.updateProductCount(this.pageItems); // ✅ update shared count

        }
        if (res.data?.minPrice !== undefined) {
          this.minPrice = res.data.minPrice;
        }
        if (res.data?.maxPrice !== undefined) {
          this.maxPrice = res.data.maxPrice;
        }
        if (res.data?.data !== undefined) {
          this.products = res.data.data;
        }
      });
    });
  }

  // Initial filters with pagination only
  initialFilters: ProductFilters = {
    pageIndex: 1,
    pageSize: 10
  };

  filters$ = new BehaviorSubject<ProductFilters>(this.initialFilters);

  get getFilters() {
    return this.filters$.value;
  }

  // Pagination logic
  display(pageIndex: number) {
    this.initialFilters = {
      ...this.initialFilters,
      pageIndex: pageIndex
    };
    this.filters$.next(this.initialFilters);
  }

  // Filter change handler
  filtersChanged(filters: any) {
    const updatedFilters: ProductFilters = {
      pageIndex: 1,
      pageSize: this.pageSize
    };

    if (filters.categoryId && filters.categoryId.length > 0) {
      updatedFilters.categoryIds = filters.categoryId;
    }

    if (filters.brandId && filters.brandId.length > 0) {
      updatedFilters.brandIds = filters.brandId;
    }

    if (filters.ratings && filters.ratings.length > 0) {
      updatedFilters.ratings = filters.ratings;
    }

    if (filters.minPrice !== this.minPrice) {
      updatedFilters.minPrice = filters.minPrice;
    }

    if (filters.maxPrice !== this.maxPrice) {
      updatedFilters.maxPrice = filters.maxPrice;
    }

    updatedFilters.inStock = filters.stockType;

    this.initialFilters = updatedFilters;
    this.filters$.next(this.initialFilters);
  }

  // Sorting or items-per-page change
  sortFiltersChanged(sortFilters: any) {
    this.pageSize = sortFilters.itemsToShow;

    this.initialFilters = {
      ...this.initialFilters,
      pageSize: sortFilters.itemsToShow,
      sort: sortFilters.sortBy
    };

    this.filters$.next(this.initialFilters);
  }
}
