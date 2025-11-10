import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BlogpostService } from '../../category/services/blogpost.service';
import { BlogPost } from '../models/blog-post.model';
import { Category } from '../../category/models/category.model';
import { CategoryService } from '../../category/services/category.service';
import { EditBlogPost } from '../models/edit-blog-post.model';
import { MessageService } from 'primeng/api';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-edit-blogpost',
  templateUrl: './edit-blogpost.component.html',
  styleUrls: ['./edit-blogpost.component.css']
})
export class EditBlogpostComponent implements OnInit, OnDestroy{

 id : string | null = null;
 routeSubscription ?: Subscription;
 updateBlogPostSubscription ?: Subscription;
 getBlogPostSubscription ?: Subscription;
 imageSelectSubscription ?: Subscription;
 model? : BlogPost;

 categories$ ? : Observable<Category[]>;
 selectedCategories ? : string [];
 isImageSelectorVisible : boolean = false;
  constructor(private route : ActivatedRoute, private blogPostService : BlogpostService,
    private categoryService : CategoryService, private messageService : MessageService, private router : Router,
    private imageService:ImageService) {}
  
  ngOnInit(): void {

this.categories$ = this.categoryService.getAllCategories();

    this.route.paramMap.subscribe({
      next:(params) =>{
        this.id = params.get('id');

        if(this.id){
        this.getBlogPostSubscription =  this.blogPostService.getBlogPostById(this.id).subscribe({
            next:(response) =>{
                this.model = response;
                this.selectedCategories = response.categories.map(x=>x.id);
            }
          });
        }

        this.imageService.onSelectImage().subscribe({
          next:(response)=>{
            if(this.model){
              this.model.featuredImageUrl = response.url;
              this.isImageSelectorVisible = false;
            }
          }
        })

      }
    })
  }

  onFormSubmit() : void{
      //console.log(this.model);

      if(this.id && this.model){
        var updatedBlogPost: EditBlogPost = {
            author : this.model.author,
            content : this.model.content,
            shortDescription : this.model.shortDescription,
            featuredImageUrl : this.model.featuredImageUrl,
            isVisible : this.model.isVisible,
            publishedDate : this.model.publishedDate,
            title : this.model.title,
            urlHandle : this.model.urlHandle,
            categories:this.selectedCategories ?? []
        };

      

      this.updateBlogPostSubscription =  this.blogPostService.updateBlogPost(this.id,updatedBlogPost)
        .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Edited',
                detail: 'Blog post edited successfully'
              });
              this.router.navigateByUrl('/admin/blogposts');
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to edit BlogPost'
              });
            }
        });
      }
  }

  openImageSelector(): void {
    this.isImageSelectorVisible = true;
  }

  closeImageSelector() : void {
    this.isImageSelectorVisible = false;
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.updateBlogPostSubscription?.unsubscribe();
    this.getBlogPostSubscription?.unsubscribe();
    this.imageSelectSubscription?.unsubscribe();
  }
}
