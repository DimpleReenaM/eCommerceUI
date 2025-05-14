import { Component, Inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProductResDto } from 'src/app/core/Models/catalog';
import { BASE_API, BASE_IMAGE_API } from 'src/app/core/token/baseUrl.token';
import { AddToCart } from 'src/app/redux/cart/cart.action';
import { AppState } from 'src/app/redux/store';
import { AddToWishList } from 'src/app/redux/wishlist/wishlist.action';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],

  animations: [
    trigger('cardHover', [
        state('rest', style({
            transform: 'translateY(0)'
        })),
        state('hover', style({
            transform: 'translateY(-5px)'
        })),
        transition('rest <=> hover', animate('200ms ease-in-out'))
    ]),
    trigger('pulse', [
        transition('* => *', [
            animate('500ms ease-in-out', keyframes([
                style({ transform: 'scale(1)', offset: 0 }),
                style({ transform: 'scale(1.05)', offset: 0.5 }),
                style({ transform: 'scale(1)', offset: 1 })
            ]))
        ])
    ])
  ]
})
export class ProductCardComponent {
  hoverState: 'rest' | 'hover' = 'rest';   // default value is 'rest'
addedToCart: boolean = false;    

  constructor(@Inject(BASE_IMAGE_API) public imageUrl: string,private store:Store<AppState>) {}
   
  @Input() product!:ProductResDto;

  addToCart(productId:number){
      this.store.dispatch(AddToCart({productId,quantity:1}))
  }

  addToWishList(productId:number){
    this.store.dispatch(AddToWishList({productId}))
  }
}
