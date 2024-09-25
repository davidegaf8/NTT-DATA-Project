import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Post, Comment } from 'src/models/blog.models';
import { User } from 'src/models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private baseUrl = 'https://gorest.co.in/public/v2';
  private authToken = localStorage.getItem('authToken');

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users?per_page=100`);
  }

  getPosts(page: number, pageSize: number): Observable<Post[]> {
    return this.http.get<Post[]>(
      `${this.baseUrl}/posts?page=${page}&per_page=${pageSize}`
    );
  }

  getCommentsForPost(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/posts/${postId}/comments`);
  }

  createPost(newPost: Post): Observable<Post> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<Post>(`${this.baseUrl}/posts`, newPost, { headers });
  }
}
