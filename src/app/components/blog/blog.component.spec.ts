import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { BlogComponent } from './blog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('BlogComponent', () => {
  let component: BlogComponent;
  let fixture: ComponentFixture<BlogComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlogComponent],
      imports: [
        HttpClientTestingModule,
        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatExpansionModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });
  
  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and fetch users', () => {
    const req = httpMock.expectOne('https://gorest.co.in/public/v2/users?per_page=100');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, name: 'John Doe' }]);

    fixture.detectChanges();

    expect(component.users.length).toBe(1);
    expect(component.users[0].name).toBe('John Doe');
  });

  it('should fetch posts after users are loaded', () => {
    const usersReq = httpMock.expectOne('https://gorest.co.in/public/v2/users?per_page=100');
    usersReq.flush([{ id: 1, name: 'John Doe' }]);

    const postsReq = httpMock.expectOne('https://gorest.co.in/public/v2/posts?page=1&per_page=10');
    postsReq.flush([{ id: 1, title: 'Test Post', body: 'Test Body', user_id: 1, likes: 0, comments: [] }]);

    fixture.detectChanges();

    expect(component.posts.length).toBe(1);
    expect(component.posts[0].title).toBe('Test Post');
    expect(component.loading).toBeFalse();
  });

  it('should display the loading spinner when loading', () => {
    component.loading = true;
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('mat-progress-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should hide the loading spinner and display posts when not loading', () => {
    component.loading = false;
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('mat-progress-spinner');
    const postContainer = fixture.nativeElement.querySelector('.blog-container');
    expect(spinner).toBeFalsy();
    expect(postContainer).toBeTruthy();
  });

  it('should add a post', () => {
    const newPost = {
      id: 1,
      title: 'New Post',
      body: 'This is a new post.',
      user_id: 1,
      likes: 0,
      comments: []
    };
    const postsReq = httpMock.expectOne('https://gorest.co.in/public/v2/posts');
    postsReq.flush(newPost);

    component.addPost('New Post', 'This is a new post.');
    fixture.detectChanges();

    expect(component.posts.length).toBe(1);
    expect(component.posts[0].title).toBe('New Post');
  });

  it('should add a like to a post', () => {
    const post = { id: 1, title: 'Post 1', body: 'Body', user_id: 1, likes: 0, comments: [] };
    component.posts = [post];
    component.addLike(post);
    expect(post.likes).toBe(1);
  });

  it('should add a comment to a post', () => {
    const post = { id: 1, title: 'Post 1', body: 'Body', user_id: 1, likes: 0, comments: [] };
    component.posts = [post];
    component.addComment(post, 'New comment');
    expect(post.comments.length).toBe(1);
  });

  it('should toggle the comment box', () => {
    const post = { id: 1, title: 'Post 1', body: 'Body', user_id: 1, likes: 0, comments: [], showCommentBox: false };
    component.toggleCommentBox(post);
    expect(post.showCommentBox).toBeTrue();
    component.toggleCommentBox(post);
    expect(post.showCommentBox).toBeFalse();
  });

  it('should filter posts based on search input', () => {
    component.posts = [
      { id: 1, title: 'Angular', body: 'Angular is great', user_id: 1, likes: 0, comments: [] },
      { id: 2, title: 'React', body: 'React is awesome', user_id: 2, likes: 0, comments: [] }
    ];

    component.searchPosts({ target: { value: 'Angular' } } as any);
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].title).toBe('Angular');
  });
});

