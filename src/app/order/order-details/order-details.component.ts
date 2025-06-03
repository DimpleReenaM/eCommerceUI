import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailDTO } from 'src/app/core/Models/order';
import { OrdersService } from 'src/app/core/Services/orders.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  details!: OrderDetailDTO;
  constructor(
    private orderService: OrdersService,
    private routing: ActivatedRoute,
        private snackBar: MatSnackBar

  ) { }

  ngOnInit(): void {
    this.routing.paramMap.subscribe((params) => {

      this.orderService.getOrderDetail(Number(params.get('orderId'))).subscribe(d => {
        this.details = d;
      })
    });
  }

  cancelOrder() {
    if (this.details.order.status === 'Cancelled') return;

    const userId=localStorage.getItem('userId')

    const confirmCancel = confirm('Are you sure you want to cancel this order?');
    if (!confirmCancel) return;
            this.details.order.status = 'Cancelled';

    this.orderService.cancelOrder(this.details.order.id,this.details.order.status,userId).subscribe({
      next: (res) => {
        this.snackBar.open('Order cancelled successfully', 'Close', { duration: 2000 });
      },
      error: (err) => {
        this.snackBar.open('Failed to cancel order', 'Close', { duration: 2000 });
        console.error(err);
      }
    });
  }


}
