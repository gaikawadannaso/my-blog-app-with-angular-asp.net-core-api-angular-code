import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Blog } from '../../category/models/blog.model';
import { BlogpostService } from '../../category/services/blogpost.service';
import { Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { BlogPost } from '../models/blog-post.model';

@Component({
  selector: 'app-blogpost-list',
  templateUrl: './blogpost-list.component.html',
  styleUrls: ['./blogpost-list.component.css']
})
export class BlogpostListComponent implements OnInit {

  blogs$? : Observable<BlogPost[]>;
  deleteCategorySubscription?: Subscription

constructor(private blogpostService : BlogpostService,private router : Router,
  private messageService: MessageService,
  private confirmationService : ConfirmationService
  ){}

  ngOnInit(): void {
   this.blogs$ = this.blogpostService.getAllBlogposts()
    
  }

  onDelete(id: string): void {

    if (id) {

      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this record?',
        header: 'Confirmation',
        icon: 'fa fa-exclamation-circle',
        accept: () => {
          this.deleteCategorySubscription =  this.blogpostService.deleteBlogPostById(id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail: 'BlogPost deleted successfully'
              });
              this.blogs$ = this.blogpostService.getAllBlogposts();
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete blogpost'
              });
            }
          });
        },
        reject: (type: ConfirmEventType) => {
          switch (type) {
            case ConfirmEventType.REJECT:
              this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
              break;
            case ConfirmEventType.CANCEL:
              this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
              break;
          }
        }
      });


      // this.confirmationService.confirm({
      //   message: 'Are you sure you want to delete this record?',
      //   header: 'Confirmation',
      //   icon: 'pi pi-exclamation-triangle',
      //   accept: () => {
         
      //   },
      //   reject: () => {
      //     // logic when user clicks No
      //   }
      // });



    }

  }
  

  ngOnDestroy(): void {
    this.deleteCategorySubscription?.unsubscribe();
  }
}
