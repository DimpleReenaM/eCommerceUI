import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-tracker',
  templateUrl: './order-tracker.component.html',
  styleUrls: ['./order-tracker.component.scss']
})
export class OrderTrackerComponent {
  @Input() orderStatus!: string;
    @Input() paymentStatus!: string;


  private readonly allSteps = ['Placed', 'Confirmed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled'];

  get steps(): string[] {
    // Only show "Cancelled" step when orderStatus is "Cancelled"
    if (this.orderStatus === 'Cancelled') {
      return this.allSteps;
    }
    return this.allSteps.filter(step => step !== 'Cancelled');
  }

  isCancelledStatus(): boolean {
    return this.orderStatus === 'Cancelled';
  }

  isStepCompleted(step: string): boolean {
    if (this.isCancelledStatus()) {
      return true; // All steps appear red when cancelled
    }

    const statusOrder = ['Placed', 'Confirmed', 'Shipped', 'Out For Delivery', 'Delivered'];
    const currentIndex = statusOrder.indexOf(this.orderStatus);
    return statusOrder.indexOf(step) <= currentIndex;
  }

  getStepClass(step: string): string {
    if (this.isCancelledStatus()) {
      return 'cancelled';
    }
    return this.isStepCompleted(step) ? 'completed' : '';
  }
}
