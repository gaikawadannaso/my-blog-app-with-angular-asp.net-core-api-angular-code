import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { InsertBlogComment } from '../models/insert-blogcomment.model';
import { MessageService } from 'primeng/api';
import { BlogpostService } from '../../category/services/blogpost.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-blog-comments',
  templateUrl: './blog-comments.component.html',
  styleUrls: ['./blog-comments.component.css']
})
export class BlogCommentsComponent implements OnInit {
  
constructor(private blogpostService:BlogpostService, private messageService : MessageService,private fb: FormBuilder){

}

  @Input() BlogId!: string;

  CommentForm!:FormGroup;
  insertBlogComment?:Subscription;

  selectedRating: number | null = null;
  reviewFeedback: Record<number, { emoji: string; text: string }> = {
    1: { emoji: "😡", text: "Very Bad" },
    2: { emoji: "😕", text: "Bad" },
    3: { emoji: "😐", text: "Average" },
    4: { emoji: "😊", text: "Good" },
    5: { emoji: "🤩", text: "Excellent" }
  };
  
  ngOnInit(): void {
    this.CommentForm = this.fb.group({
      blogId: [this.BlogId],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rating: [null, Validators.required],
      comment: [''] // optional
    });
  }

  onFormSubmit(): void {
    if (this.CommentForm.invalid) {
      this.CommentForm.markAllAsTouched();
      return;
    }

    const blogComment: InsertBlogComment = this.CommentForm.value;

    this.insertBlogComment = this.blogpostService.insertBlogComment(blogComment).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Thanks for the Feedback'
        });

        this.CommentForm.reset({
          blogId: this.BlogId,
          fullName: '',
          email: '',
          rating: null,
          comment: ''
        });
        this.selectedRating = null;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add comment'
        });
      }
    });
  }
  setRating(value: number) {
    this.selectedRating = value;
    this.CommentForm.patchValue({ rating: value });
  }

  ngOnDestroy(): void {
    this.insertBlogComment?.unsubscribe();
  }
}
