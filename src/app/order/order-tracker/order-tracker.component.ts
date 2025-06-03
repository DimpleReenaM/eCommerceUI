
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-tracker',
  templateUrl: './order-tracker.component.html',
  styleUrls: ['./order-tracker.component.scss']
})
export class OrderTrackerComponent {
  @Input() orderStatus!: string;
  @Input() paymentStatus!: string;

  get steps(): string[] {
    if (this.paymentStatus?.toLowerCase() === 'failed') {
      return ['Payment Failed', 'Confirmed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled'];
    }
    return ['Placed', 'Confirmed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled'];
  }

  isStepCompleted(step: string): boolean {
    if (this.paymentStatus?.toLowerCase() === 'failed') {
      return true;  // All steps appear completed when payment failed
    }

    if (this.orderStatus === 'Cancelled') {
      return step === 'Cancelled';
    }

    const statusOrder = ['Placed', 'Confirmed', 'Shipped', 'Out For Delivery', 'Delivered'];
    const currentIndex = statusOrder.indexOf(this.orderStatus);
    return statusOrder.indexOf(step) <= currentIndex;
  }

  getStepClass(step: string): string {
    if (this.paymentStatus?.toLowerCase() === 'failed') {
      return 'failed';  // Apply orange color to all steps
    }
    if (this.orderStatus === 'Cancelled' && step === 'Cancelled') {
      return 'cancelled';  // Optional special styling
    }
    return this.isStepCompleted(step) ? 'completed' : '';
  }
}
