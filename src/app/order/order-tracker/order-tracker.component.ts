import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-tracker',
  templateUrl: './order-tracker.component.html',
  styleUrls: ['./order-tracker.component.scss']
})
export class OrderTrackerComponent {


  @Input() orderStatus!:string;
  @Input() paymentStatus!:string;
    steps: string[] = [
    'Placed',
    'Confirmed',
    'Shipped',
    'Out For Delivery',
    'Delivered',
    'Cancelled'
  ];

  isStepCompleted(step: string): boolean {
     if (this.orderStatus === 'Cancelled') {
    return step === 'Cancelled';
  }

    const statusOrder = [
      'Placed',
      'Confirmed',
      'Shipped',
      'Out For Delivery',
      'Delivered',
      'Cancelled'
    ];

    const currentStatus = this.paymentStatus.toLowerCase() === 'failed' ? 'Payment Failed' : this.orderStatus;
    const currentIndex = statusOrder.indexOf(
      currentStatus === 'Payment Failed' ? 'Payment' : currentStatus
    );

    return statusOrder.indexOf(step) <= currentIndex && this.paymentStatus.toLowerCase() !== 'failed';
  }
}
