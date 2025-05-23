// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { Store } from '@ngrx/store';
// import { ProductResDto } from 'src/app/core/Models/catalog';
// import { CatalogService } from 'src/app/core/Services/catalog.service';
// import { AddToCart } from 'src/app/redux/cart/cart.action';
// import { AppState } from 'src/app/redux/store';
// import { AddToWishList } from 'src/app/redux/wishlist/wishlist.action';

// @Component({
//   selector: 'app-product-detail',
//   templateUrl: './product-detail.component.html',
//   styleUrls: ['./product-detail.component.css']
// })
// export class ProductDetailComponent implements OnInit {
//   product!:ProductResDto;
//   quantity:number=1;
//   constructor(
//     private _route: ActivatedRoute,
//     private catalogService:CatalogService,
//     private store:Store<AppState>
//   ){}

//   ngOnInit(): void {
//     this._route.paramMap.subscribe(param=>{
//       const id=param.get('id');
//       if(id){
//         this.catalogService.getProductById(id).subscribe(res=>{
//           if(res.data) this.product=res.data;
//         })
//       }
//     })

    
//   }

//   updateQuantity(quantity:number){
//     this.quantity=quantity;
//   }

//   addToCart(productId:number){
//     this.store.dispatch(AddToCart({productId,quantity:this.quantity}))
// }
//   addToWishList(productId:number){
//     this.store.dispatch(AddToWishList({productId}))
//   }
// }
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ProductResDto } from 'src/app/core/Models/catalog';
import { CatalogService } from 'src/app/core/Services/catalog.service';
import { ReviewService } from 'src/app/core/Services/review.service';
import { AddToCart } from 'src/app/redux/cart/cart.action';
import { AppState } from 'src/app/redux/store';
import { AddToWishList } from 'src/app/redux/wishlist/wishlist.action';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  @ViewChild('reviewForm') reviewForm!: NgForm;
  product!:ProductResDto;
  quantity:number=1;
  reviewText: string = '';
rating: number = 5;

  constructor(
    private _route: ActivatedRoute,
    private catalogService:CatalogService,
    private store:Store<AppState>,
    private reviewservice:ReviewService
  ){}

  ngOnInit(): void {
    this._route.paramMap.subscribe(param=>{
      const id=param.get('id');
      if(id){
        this.catalogService.getProductById(id).subscribe(res=>{
          if(res.data) this.product=res.data;
        })
      }
    })

    
  }

  updateQuantity(quantity:number){
    this.quantity=quantity;
  }

  addToCart(productId:number){
    this.store.dispatch(AddToCart({productId,quantity:this.quantity}))
}
  addToWishList(productId:number){
    this.store.dispatch(AddToWishList({productId}))
  }

  submitReview(form: NgForm) {
    if (!this.product) return;
  
    const reviewPayload = { 
      review: this.reviewText,
      rating: this.rating,
      productId: this.product.id,
      
     
    };
    this.reviewservice.post('review', reviewPayload).subscribe({
      next: (response) => {
        console.log('Review submitted successfully', response);
        alert('Review submitted successfully!');  this.reviewText = '';
      
      },
      error: (err) => {
        alert('Review submitted successfully!');
        this.reviewText = '';
        this.rating = 5;
        form.resetForm({ rating: 5 });      }
    });
  }
  // loadReviews() {
  //   this.reviewservice.get(`review/${this.product.id}`).subscribe({
  //     next: (reviews) => {
  //       this.product.averageRating = reviews; // Assume you have `reviews` array in your product
  //     },
  //     error: (error) => {
  //       console.error('Error loading reviews:', error);
  //     }
  //   });
  // }
  
}
