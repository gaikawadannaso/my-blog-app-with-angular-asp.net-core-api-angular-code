import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Blog } from '../models/blog.model';
import { AddBlogPost } from '../../blog-post/models/add-blog-post.model';
import { BlogPost } from '../../blog-post/models/blog-post.model';
import { EditBlogPost } from '../../blog-post/models/edit-blog-post.model';
import { InsertBlogComment } from '../../public/models/insert-blogcomment.model';


@Injectable({
  providedIn: 'root'
})
export class BlogpostService {


  constructor(private http : HttpClient) { }

  

  getAllBlogposts():Observable<BlogPost[]>{
    return this.http.get<BlogPost[]>(`${environment.apiBaseUrl}/api/blogposts`);
  }



  getBlogPostById(id:string):Observable<BlogPost>{
    return this.http.get<BlogPost>(`${environment.apiBaseUrl}/api/blogposts/${id}`);
  }

  createBlogPost(data:AddBlogPost): Observable<BlogPost>{

    return this.http.post<BlogPost>(`${environment.apiBaseUrl}/api/blogposts?addAuth=true`,data);
  }
  insertBlogComment(data:InsertBlogComment): Observable<InsertBlogComment>{
    return this.http.post<InsertBlogComment>(`${environment.apiBaseUrl}/api/BlogComment`,data);
  }
  updateBlogPost(id : string, updatedBlogPost:EditBlogPost): Observable<BlogPost>{
    return this.http.put<BlogPost>(`${environment.apiBaseUrl}/api/blogposts/${id}?addAuth=true`,updatedBlogPost);
  }

  deleteBlogPostById(id:string):Observable<BlogPost>{
    return this.http.delete<BlogPost>(`${environment.apiBaseUrl}/api/blogposts/${id}?addAuth=true`);
  }

  getBlogPostByUrlHandle(urlHandle:string):Observable<BlogPost>{
    return this.http.get<BlogPost>(`${environment.apiBaseUrl}/api/blogposts/${urlHandle}`);
  }
}
