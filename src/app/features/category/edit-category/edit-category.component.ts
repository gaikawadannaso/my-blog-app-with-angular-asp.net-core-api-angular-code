import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Unsubscribable } from 'rxjs';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { UpdateCategoryRequest } from '../models/update-category-request.model';
import { MessageService } from 'primeng/api';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit, OnDestroy {


  id:string | null = null;
  paramSubscription?:Subscription;
  editCategorySubscription?:Subscription;
category?:Category;


  constructor(private route : ActivatedRoute,
    private categoryService : CategoryService,
    private router : Router,
    private messageService: MessageService
    ){

  }
  
  ngOnInit(): void {
    this.paramSubscription = this.route.paramMap.subscribe({
      next:(param)=>{
        this.id = param.get('id');
        if(this.id){
            this.categoryService.getCategoryById(this.id)
            .subscribe({
              next:(responce)=>{
                this.category=responce;
              }
            })
        }
      }
    })
  }


  getErrorMessage(control: NgModel, label: string): string | null {
    if (control.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) return `${label} is required`;
      if (control.errors?.['minlength']) return `${label} must be at least 3 characters`;
      if (control.errors?.['maxlength']) return `${label} cannot exceed 50 characters`;
      if (control.errors?.['pattern']) return `${label} allows only letters, spaces, and hyphens`;
    }
    return null;
  }

  onFormSubmit() {
    // console.log(this.category);
    const updateCategoryRequest : UpdateCategoryRequest={
      name : this.category?.name ?? '',
      urlHandle : this.category?.urlHandle ?? ''
    };
    if(this.id){
      this.categoryService.updateCategory(this.id,updateCategoryRequest)
      .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Edited',
              detail: 'Category edited successfully'
            });
            this.router.navigateByUrl('/admin/categories');
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to edit category'
            });
          }
      });
    }
  }

  ngOnDestroy(): void {
    this.paramSubscription?.unsubscribe();
    this.editCategorySubscription?.unsubscribe();
  }
}
