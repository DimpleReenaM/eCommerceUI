import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { MyBrand } from 'src/app/core/Models/MyBrand';
import { MyCategory } from 'src/app/core/Models/MyCategory';
import { MyProduct } from 'src/app/core/Models/MyProduct';
import { AuthService } from 'src/app/core/Services/auth.service';
import { CatalogService } from 'src/app/core/Services/catalog.service';
import { MybrandService } from 'src/app/core/Services/mybrand.service';
import { MycategoryService } from 'src/app/core/Services/mycategory.service';
import { MyproductService } from 'src/app/core/Services/myproduct.service';
import { SellerService } from 'src/app/core/Services/seller.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  products: MyProduct[] = [];
  productForm: FormGroup;
  brands: MyBrand[] = [];
  categories: MyCategory[] = [];
  selectedFile: File | null = null;
  uploadedImages: File[] = [];
  editingProductId: any = null;
  modalVisible: boolean = false;

  constructor(
    private productService1: SellerService,
    private router: Router,
    private fb: FormBuilder,
    private productService: MyproductService,
    private brandService: MybrandService,
    private categoryService: MycategoryService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient,
    private catalogservice: CatalogService,
    private authService: AuthService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      originalPrice: [0, Validators.required],
      discountPercentage: [0],
      discountAmount: [{ value: 0, disabled: true }],
      newPrice: [{ value: 0, disabled: true }],
      stockQuantity: ['', [Validators.required, Validators.min(1)]],
      categoryId: ['', Validators.required],
      brandId: ['', Validators.required],
      thumbnail: [null],
        isActive: [true]  // ✅ default to true when adding

    });
  }
  ngOnInit(): void {
    this.loadBrands();
    this.loadCategories();
    this.loadProducts();
    this.productForm.valueChanges.subscribe(() => {
      this.calculatePrice();
    });
  }

  // Open Modal (Add or Edit)
openModal(product: MyProduct | null = null): void {
  const modalElement = document.getElementById('productModal');
  if (modalElement) {
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  } else {
    console.error('Modal element not found');
  }

  this.modalVisible = true;
  if (product) {
    this.editingProductId = product.id;
    // Populate form for editing
    this.productForm.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      originalPrice: product.originalPrice,
      stockQuantity: product.stockQuantity,
      discountPercentage: product.discountPercentage,
      discountAmount: product.discountAmount,
      newPrice: product.newPrice,
      categoryId: product.category.id,
      brandId: product.brand.id,
      isActive: product.isDeleted
    });
  } else {
    this.productForm.reset();  // Reset for new product
    this.editingProductId = null;
  }
  this.productForm.get('discountAmount')?.disable();
  this.productForm.get('newPrice')?.disable();
  this.selectedFile = null;
}


  // Close Modal
  closeModal(): void {
    const modalElement = document.getElementById('productModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement); // Get the existing modal instance
      if (modal) {
        modal.hide(); // Close the modal
      }
    } else {
      console.error('Modal element not found');
    }

    this.modalVisible = false;
  }

  // Resolve Image URL
  getImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) return 'assets/default-image.jpg'; 
    return `https://localhost:7174/${imagePath}`;
  }

  // File Selected Handler
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  // Calculate Price based on Discount
  calculatePrice(): void {
    const originalPrice = this.productForm.get('originalPrice')?.value || 0;
    const discountPercentage = this.productForm.get('discountPercentage')?.value || 0;
    const discountAmount = (originalPrice * discountPercentage) / 100;
    const newPrice = originalPrice - discountAmount;

    this.productForm.patchValue(
      {
        discountAmount: discountAmount,
        newPrice: newPrice
      },
      { emitEvent: false }
    );
  }

  // Load Brands from API
  loadBrands(): void {
    this.brandService.getBrands().subscribe(
      (brands: MyBrand[]) => {
        this.brands = brands;
      },
      (error) => {
        console.error('Error fetching brands:', error);
      }
    );
  }

  // Load Categories from API
  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (categories: MyCategory[]) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  // Load Products from API
  loadProducts() {
    const userID = localStorage.getItem('userId');
    if (userID) {
      const parsedUserId = Number(userID);
      this.productService1.getSellerProducts(parsedUserId).subscribe(products => {
        this.products = products;
      });
    }
  }

  // Add Product Navigation
  addProduct() {
    this.router.navigate(['/add-product']);
  }

  // Edit Product
  editProduct(product: MyProduct) {
    this.openModal(product);
  }

  // Form Submit (Add/Edit Product)
  onSubmit() {
    const formValue = this.productForm.value;
    const formData = new FormData();

    Object.keys(this.productForm.controls).forEach((key) => {
      const controlValue = this.productForm.get(key)?.value;
      if (controlValue !== null && controlValue !== undefined) {
        const value = typeof controlValue === 'number' ? controlValue.toString() : controlValue;
        formData.append(key, value);
      }
    });

    if (this.editingProductId) {
      formData.append('Id', this.editingProductId.toString());
    }

    if (this.selectedFile) {
      formData.append('thumbnail', this.selectedFile);
    }

    const user = this.authService.getLoggedInUser();
    if (user && user.userId) {
      if (this.editingProductId) {
        formData.append('UpdatedBy', user.userId.toString());
      } else {
        formData.append('CreatedBy', user.userId.toString());
      }
    }

    if (this.editingProductId) {
      this.productService.updateProduct(formData).subscribe(
        () => {
          this.loadProducts();
          this.closeModal();
        },
        (error) => {
          console.error('Error updating product', error);
        }
      );
    } else {
      if (this.productForm.valid) {
        this.productService.addProduct(formData).subscribe(
          (response) => {
            console.log('Product added successfully', response);
            this.loadProducts();
            this.closeModal();
          },
          (error) => {
            console.error('Error adding product', error);
          }
        );
      } else {
        alert('Please fill in all required fields correctly.');
      }
    }
  }
  getLowStockCount(): number {
  return this.products.filter(p => p.stockQuantity < 10).length;
}
// getDiscountedCount(): number {
//   return this.products.filter(p => p.discountPercentage > 0).length;
// }

  // Delete Product
  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }
}
