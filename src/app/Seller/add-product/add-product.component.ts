import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MyBrand } from 'src/app/core/Models/MyBrand';
import { MyCategory } from 'src/app/core/Models/MyCategory';
import { AuthService } from 'src/app/core/Services/auth.service';
import { CatalogService } from 'src/app/core/Services/catalog.service';
import { MybrandService } from 'src/app/core/Services/mybrand.service';
import { MycategoryService } from 'src/app/core/Services/mycategory.service';
import { MyproductService } from 'src/app/core/Services/myproduct.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit{
  productForm: FormGroup;
  brands: MyBrand[] = [];
  categories: MyCategory[] = [];
  selectedFile: File | null = null;
  uploadedImages: File[] = [];



  constructor(
    private fb: FormBuilder,
    private productService: MyproductService,
    private brandService: MybrandService,
    private categoryService: MycategoryService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient,
    private catalogservice: CatalogService,
    private authService: AuthService,
    // private alertservice:AlertService,
    private router:Router
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
      // createdBy: [0],
      // ram: ['', Validators.required],
      // storage: ['', Validators.required],
      // displaySize: ['', Validators.required],
      // processor: ['', Validators.required],      
      // warranty: ['', Validators.required],       
      // batteryCapacity: ['', Validators.required] 
    });
  }

  ngOnInit(): void {
    this.loadBrands();
    this.loadCategories();
    this.productForm.valueChanges.subscribe(() => {
      this.calculatePrice();
    });
  }

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

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = new FormData();
      Object.keys(this.productForm.controls).forEach((key) => {
        const controlValue = this.productForm.get(key)?.value;
        if (controlValue !== null && controlValue !== undefined) {
          formData.append(key, controlValue.toString());
        }
      });
      
      
    const user = this.authService.getLoggedInUser();
    if (user && user.userId) {
      console.log(user.userId)
      formData.append('CreatedBy', user.userId.toString());
    } else {
      console.error('User ID is missing, cannot set CreatedBy');
    }
      
      if (this.selectedFile) {
        formData.append('thumbnail', this.selectedFile);
      }  
        
      this.productService.addProduct(formData).subscribe(
        (response) => {
          console.log('Product added successfully', response);
          this.productForm.reset();
          alert('Product added successfully!');
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


