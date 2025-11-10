import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { Observable, Subscription } from 'rxjs';
import { Route, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs/operators';
@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categories$? : Observable<Category[]>;
  pageNumber = 1;
  pageSize = 2;
  totalCount = 0;
  pageShowCount = 2;

  pageList : number[] = [];
  deleteCategorySubscription?: Subscription

constructor(private categoryService : CategoryService,private router : Router,private messageService: MessageService){

}


ngOnInit(): void {
  this.categories$ = this.categoryService.getAllCategories(undefined, undefined, undefined, this.pageNumber, this.pageSize)
    .pipe(
      tap(response => {
        if (response) {
          this.totalCount = response[0].totalCount;
          this.pageList = new Array(Math.ceil(response[0].totalCount/this.pageSize))
        }
      })
    );
}
  onSearch(query: string){
    this.categories$ = this.categoryService.getAllCategories(query);
  }

  pagination(pageNumber : number){
    this.pageNumber = pageNumber;
    this.categories$ = this.categoryService.getAllCategories(undefined, undefined, undefined, pageNumber, this.pageSize)
  }

  previousPage(){
    if(this.pageNumber - 1 < 1){
      return;
    }
    this.pageNumber -=1;
    this.categories$ = this.categoryService.getAllCategories(undefined, undefined, undefined, this.pageNumber, this.pageSize)
  }

  nextPage(){
    if(this.pageNumber + 1 > this.pageList.length){
      return;
    }
    this.pageNumber +=1;
    this.categories$ = this.categoryService.getAllCategories(undefined, undefined, undefined, this.pageNumber, this.pageSize)
  }

  

  sort(sortBy: string, sortDirection : string){
    this.categories$ = this.categoryService.getAllCategories(undefined,sortBy,sortDirection);
  }

  onDelete(id: string): void {
    if (id) {
      this.categoryService.deleteCategoryById(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Category deleted successfully'
          });
          this.categories$ = this.categoryService.getAllCategories();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete category'
          });
        }
      });
    }
  }
  

  ngOnDestroy(): void {
    this.deleteCategorySubscription?.unsubscribe();
  }
}
