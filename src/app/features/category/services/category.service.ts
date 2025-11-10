import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddCategoryRequest } from '../models/add-category-request.model';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from 'src/environments/environment';
import { UpdateCategoryRequest } from '../models/update-category-request.model';
import { Dashboard } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http : HttpClient) { }



  getAllCategories(query?:string, sortBy?:string, sortDirection? : string , pageNumber : number = 1, pageSize : number = 10):Observable<Category[]>{
let param = new HttpParams();
if(query){
param = param.set('query',query);
}
if(sortBy){
  param = param.set('sortBy',sortBy);
  }
  if(sortDirection){
    param = param.set('sortDirection',sortDirection);
    }
    if(pageNumber){
      param = param.set('pageNumber',pageNumber);
      }

      if(pageSize){
        param = param.set('pageSize',pageSize);
        }
    return this.http.get<Category[]>(`${environment.apiBaseUrl}/api/categories`,{
      params:param
    });
  }

  getCategoryById(id:string):Observable<Category>{
    return this.http.get<Category>(`${environment.apiBaseUrl}/api/categories/${id}`);
  }
  getDashboardData():Observable<Dashboard>{
    return this.http.get<Dashboard>(`${environment.apiBaseUrl}/api/categories/Dashboard?addAuth=true`);
  }



  addCategory(model:AddCategoryRequest):Observable<void>{
    return this.http.post<void>(`${environment.apiBaseUrl}/api/categories?addAuth=true`,model);
  }
  updateCategory(id:string, updateCategoryRequest:UpdateCategoryRequest):Observable<Category>{
    return this.http.put<Category>(`${environment.apiBaseUrl}/api/categories/${id}?addAuth=true`,updateCategoryRequest);
  }

  deleteCategoryById(id:string):Observable<Category>{
    return this.http.delete<Category>(`${environment.apiBaseUrl}/api/categories/${id}?addAuth=true`);
  }
}
