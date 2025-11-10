import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';

import { AddBlogPost } from '../models/add-blog-post.model';
import { Category } from '../../category/models/category.model';
import { CategoryService } from '../../category/services/category.service';
import { BlogpostService } from '../../category/services/blogpost.service';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css']
})
export class AddBlogpostComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isImageSelectorVisible: boolean = false;
  categories$?: Observable<Category[]>;
  addBlogPostSubscription?: Subscription;
  imageSelectorSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private blogpostService: BlogpostService,
    private router: Router,
    private messageService: MessageService,
    private categoryService: CategoryService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      urlHandle: ['', Validators.required],
      shortDescription: ['', [Validators.required, Validators.maxLength(250)]],
      content: ['', Validators.required],
      featuredImageUrl: [''],
      author: ['', Validators.required],
      isVisible: [true],
      publishedDate: [new Date(), Validators.required],
      categories: [[]]
    });

    this.categories$ = this.categoryService.getAllCategories();

    this.imageSelectorSubscription = this.imageService.onSelectImage().subscribe({
      next: (selectedImage) => {
        this.form.patchValue({ featuredImageUrl: selectedImage.url });
        this.closeImageSelector();
      }
    });
  }

  onFormSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const blogPost: AddBlogPost = this.form.value;

    this.addBlogPostSubscription = this.blogpostService.createBlogPost(blogPost).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Blog added successfully'
        });
        this.router.navigateByUrl('/admin/blogposts');
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add Blog'
        });
      }
    });
  }

  openImageSelector(): void {
    this.isImageSelectorVisible = true;
  }

  closeImageSelector(): void {
    this.isImageSelectorVisible = false;
  }

  ngOnDestroy(): void {
    this.addBlogPostSubscription?.unsubscribe();
    this.imageSelectorSubscription?.unsubscribe();
  }
}
