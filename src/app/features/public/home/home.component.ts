import { Component, OnInit } from '@angular/core';
import { BlogpostService } from '../../category/services/blogpost.service';
import { Observable } from 'rxjs';
import { BlogPost } from '../../blog-post/models/blog-post.model';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

blogs$?:Observable<BlogPost[]>;

  constructor( private blogPostService : BlogpostService){

  }
  ngOnInit(): void {
   this.blogs$ = this.blogPostService.getAllBlogposts();


  }
}
