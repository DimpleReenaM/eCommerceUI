import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { CatalogService } from 'src/app/core/Services/catalog.service';

@Component({
  selector: 'app-sort-header',
  templateUrl: './sort-header.component.html',
  styleUrls: ['./sort-header.component.css']
})
export class SortHeaderComponent implements OnInit{
  productCount: number = 0;

  readonly showOptions: number[] = [10, 20, 30, 50, 100];
  readonly sortOptions = [
    {
      sortName:'Featured',
      sortCode:'featured'
    },
    {
      sortName:'Price: Low to High',
      sortCode:'price_lth'
    },
    {
      sortName:'Price: High to Low',
      sortCode:'price_htl'
    },
    {
      sortName:'Rating',
      sortCode:'rating'
    },
    {
      sortName:'Newest',
      sortCode:'newest'
    }
];
constructor(private sharedService:  CatalogService) {}
ngOnInit(): void {
  this.sharedService.productCount$.subscribe((count) => {
    this.productCount = count;
  });
}


  @Input() itemsToShow:number=10;
  @Input() sortBy: string = 'featured';
    @Input() pageItems: number = 0;


  @Output() sortHeaderChanges = new EventEmitter<any>();

  // itemsToShowChange(obj:MatSelectChange){
  //  this.itemsToShow=obj.value;
  //  this.applyChanges();
  // }

  itemsToShowChange(){
    this.applyChanges();
   }

  // sortByChange(obj:MatSelectChange){
  //   this.sortBy=obj.value;
  //   this.applyChanges();
  // }
  sortByChange(){
    this.applyChanges();
  }
  
  applyChanges(){
    const sortFilter = {
      itemsToShow:this.itemsToShow,
      sortBy:this.sortBy
    }

    this.sortHeaderChanges.emit(sortFilter);
  }

}
