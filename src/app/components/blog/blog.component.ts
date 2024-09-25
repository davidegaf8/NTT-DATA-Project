import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/models/user.model';
import { Post, Comment, Reply } from 'src/models/blog.models';
import { randomNames } from 'src/models/random-names.model';
import { take, tap } from 'rxjs';
import { BlogService } from 'src/app/services/blog-service.service';


const RANDOM_NAMES = randomNames;

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit, AfterViewInit {
  posts: Post[] = [];
  users: User[] = [];
  dataSource = new MatTableDataSource<Post>(this.posts);
  pageSizeOptions: number[] = [5, 10, 20];
  pageSize = 10;
  pageIndex = 0;
  length = 100; // Numero totale di post
  loading = true;
  user = {} as User;
  accessToken = localStorage.getItem('authToken');

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private blogService: BlogService) {} // Iniettare il servizio

  ngOnInit(): void {
    this.fetchUsers();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    } else {
      this.user = {
        id: 1234567,
        name: 'Current',
        surname: 'User',
        email: 'current@user.com',
        gender: 'N/A',
        status: 'active',
      };
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.initialized.pipe(take(1)).subscribe(() => {
        this.paginator.page.pipe(tap(() => this.fetchAllPosts())).subscribe();
      });
    }
  }

  // Usa il servizio per ottenere gli utenti
  fetchUsers(): void {
    this.blogService.getUsers().subscribe((users) => {
      this.users = users;
      this.fetchAllPosts();
    });
  }

  // Usa il servizio per ottenere i post
  fetchAllPosts(): void {
    let posts: Post[] = [];
    const pagesToFetch = Math.ceil(this.length / this.pageSize);

    const fetchPage = (page: number) => {
      this.blogService.getPosts(page, this.pageSize).subscribe((fetchedPosts) => {
        fetchedPosts.forEach((post) => {
          const user = this.users.find((user) => user.id === post.user_id);
          post.userName = user ? user.name : this.getRandomName();
          post.likes = 0;
          post.comments = [];
          posts.push(post);
        });

        if (page < pagesToFetch) {
          fetchPage(page + 1);
        } else {
          this.posts = posts;
          this.length = this.posts.length;
          this.fetchCommentsForPosts(this.posts);
        }
      });
    };

    fetchPage(1);
  }

  // Genera un nome casuale
  getRandomName(): string {
    const randomIndex = Math.floor(Math.random() * RANDOM_NAMES.length);
    return RANDOM_NAMES[randomIndex];
  }

  // Usa il servizio per ottenere i commenti
  fetchCommentsForPosts(posts: Post[]): void {
    const commentRequests = posts.map((post) =>
      this.blogService.getCommentsForPost(post.id).toPromise()
    );

    Promise.all(commentRequests).then((commentsArray) => {
      commentsArray.forEach((comments, index) => {
        posts[index].comments = comments || [];
        comments!.forEach((comment) => {
          const user = this.users.find((user) => user.id === comment.user_id);
          comment.userName = user ? user.name : this.getRandomName();
          comment.replies = [];
        });
      });
      this.updateDataSource();
      this.loading = false;
    });
  }

  // Aggiorna la tabella dei dati
  updateDataSource(): void {
    this.dataSource.data = this.posts.slice(
      this.pageIndex * this.pageSize,
      (this.pageIndex + 1) * this.pageSize
    );
    if (this.paginator) {
      this.paginator.length = this.length;
    }
  }

  // Gestisce il cambiamento di pagina
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDataSource();
  }

  // Usa il servizio per creare un post
  addPost(title: string, body: string): void {
    if (!title || !body) return;
    const newPost: Post = {
      id: 0,
      user_id: this.users[1].id,
      title,
      body,
      userName: this.user.name + ' ' + this.user.surname,
      likes: 0,
      comments: [],
    };
    this.posts.unshift(newPost);
    this.updateDataSource();
    this.blogService.createPost(newPost).subscribe({
      next: (post) => {},
      error: (err) => {
        alert('Failed to create post');
      },
    });
  }

  // Cerca i post
  searchPosts(event: Event): void {
    const target = event.target as HTMLInputElement;
    const searchTerm = target.value.toLowerCase();

    this.dataSource.data = this.posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.body.toLowerCase().includes(searchTerm)
    );
  }

  addLike(post: Post): void {
    post.likes += 1;
  }

  addComment(post: Post, commentBody: string): void {
    if (!commentBody) return;
    const newComment: Comment = {
      id: post.comments.length + 1,
      postId: post.id,
      body: commentBody,
      user_id: 1, // Assuming a default user ID, replace with actual user logic
      userName: this.user.name + ' ' + this.user.surname, // Replace with actual user name
      replies: [],
    };
    post.comments.push(newComment);
  }

  toggleCommentBox(post: Post): void {
    post.showCommentBox = !post.showCommentBox;
  }

  addReply(comment: Comment, replyBody: string): void {
    if (!replyBody) return;
    const newReply: Reply = {
      id: comment.replies?.length ? comment.replies.length + 1 : 1,
      commentId: comment.id,
      body: replyBody,
      user_id: 1, // Assuming a default user ID, replace with actual user logic
      userName: this.user.name + ' ' + this.user.surname, // Replace with actual user name
    };
    comment.replies?.push(newReply);
  }

  toggleReplyBox(comment: Comment): void {
    comment.showReplyBox = !comment.showReplyBox;
  }
}                                                                   