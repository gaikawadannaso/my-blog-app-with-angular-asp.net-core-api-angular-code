import { Component, OnDestroy } from '@angular/core';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { CategoryService } from '../services/category.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnDestroy{
  model:AddCategoryRequest;
  private addCategorySubscription ?: Subscription


  
  constructor(private categoryService:CategoryService,private router : Router,private messageService: MessageService) {
   this.model={
    name:'',
    urlHandle :''

   }

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

  onFormSubmit(){
    //console.log(this.model);
   this.addCategorySubscription = this.categoryService.addCategory(this.model)
    .subscribe({
      
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Category added successfully'
        });
        this.router.navigateByUrl('/admin/categories');
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add category'
        });
      }

    })
  }


  ngOnDestroy(): void {
    this.addCategorySubscription?.unsubscribe();
  }

}
