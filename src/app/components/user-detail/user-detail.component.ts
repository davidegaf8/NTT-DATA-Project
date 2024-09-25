import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { User } from 'src/models/user.model';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit {
  user!: User;
  posts: Post[] = [];
  showPosts = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.fetchUserAndPosts(Number(userId));
    }
  }

  fetchUserAndPosts(userId: number): void {
    const userRequest = this.http.get<User>(
      `https://gorest.co.in/public/v2/users/${userId}`
    );
    const postsRequest = this.http.get<Post[]>(
      `https://gorest.co.in/public/v2/posts?user_id=${userId}`
    );

    forkJoin([userRequest, postsRequest]).subscribe(([user, posts]) => {
      this.user = user;
      this.posts = posts;
    });
  }

  togglePosts(): void {
    this.showPosts = !this.showPosts;
  }

  goBack(): void {
    window.history.back();
  }
}
