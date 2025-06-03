import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pragination',
  templateUrl: './pragination.component.html',
  styleUrls: ['./pragination.component.css']
})
export class PraginationComponent {
  @Input() pageItems = 240;
  @Input() currentPage = 1; 
  @Input() pageSize = 20;

  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.pageItems / this.pageSize);
  }

  getPaginationArray(): number[] {
    const pages = [];
    if (this.totalPages <= 5) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else if (this.currentPage <= 3) {
      pages.push(1, 2, 3, 4, -1, this.totalPages);
    } else if (this.currentPage >= this.totalPages - 2) {
      pages.push(1, -1, this.totalPages - 3, this.totalPages - 2, this.totalPages - 1, this.totalPages);
    } else {
      pages.push(1, -1, this.currentPage - 1, this.currentPage, this.currentPage + 1, -1, this.totalPages);
    }
    return pages;
  }

  onPageChange(pageIndex: number) {
    if (pageIndex >= 1 && pageIndex <= this.totalPages) {
      this.currentPage = pageIndex;
      this.pageChange.emit(pageIndex);
    }
  }
}
