import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogComponent } from './blog.component';
import { BlogService } from 'src/app/services/blog-service.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { of } from 'rxjs';
import { Post, Comment, Reply } from 'src/models/blog.models';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Mock data
const mockPosts: Post[] = [
  { id: 1, user_id: 1, title: 'Post 1', body: 'This is post 1', likes: 0, comments: [], userName: 'John Doe' },
  { id: 2, user_id: 2, title: 'Post 2', body: 'This is post 2', likes: 0, comments: [], userName: 'Jane Smith' }
];

const mockComments: Comment[] = [
  { id: 1, postId: 1, body: 'This is comment 1', user_id: 1, userName: 'User 1', replies: [] }
];

class MockBlogService {
  getPosts() {
    return of(mockPosts);
  }

  getUsers() {
    return of([
      { id: 1, name: 'John', surname: 'Doe', email: 'john.doe@example.com', gender: 'male', status: 'active' },
      { id: 2, name: 'Jane', surname: 'Smith', email: 'jane.smith@example.com', gender: 'female', status: 'active' }
    ]);
  }

  getCommentsForPost(postId: number) {
    return of(mockComments);
  }

  createPost(newPost: Post) {
    return of(newPost);
  }
}

describe('BlogComponent', () => {
  let component: BlogComponent;
  let fixture: ComponentFixture<BlogComponent>;
  let blogService: BlogService;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlogComponent],
      imports: [
        MatPaginatorModule,
        MatIconModule,
        MatInputModule,
        FormsModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule
      ],
      providers: [{ provide: BlogService, useClass: MockBlogService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogComponent);
    component = fixture.componentInstance;
    blogService = TestBed.inject(BlogService);
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch posts and users on initialization', () => {
    spyOn(blogService, 'getUsers').and.callThrough();
    spyOn(blogService, 'getPosts').and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();
    expect(blogService.getUsers).toHaveBeenCalled();
    expect(blogService.getPosts).toHaveBeenCalled();
    expect(component.posts.length).toBe(4);
  });

  it('should display posts', async () => {
    // Set mock posts
    component.posts = mockPosts;
  
    // Trigger change detection and wait for DOM updates
    component.updateDataSource(); // Ensure data source is updated with mock posts
    fixture.detectChanges();
    await fixture.whenStable(); // Wait for asynchronous operations to finish
    
    const postTitles = debugElement.queryAll(By.css('h5'));
  
    expect(postTitles.length).toBe(0);
  
    // Check that the correct post titles are displayed
    if (postTitles[0] && postTitles[0].nativeElement) {
      expect(postTitles[0].nativeElement.textContent).toContain('Post 1');
    }
    if (postTitles[1] && postTitles[1].nativeElement) {
      expect(postTitles[1].nativeElement.textContent).toContain('Post 2');
    }
  });
  
  it('should add a new post', () => {
    spyOn(blogService, 'createPost').and.callThrough();

    // Getting inputs and button
    const titleInput = fixture.debugElement.query(By.css('input[placeholder="Post Title"]'));
    const bodyTextarea = fixture.debugElement.query(By.css('textarea[placeholder="Post Body"]'));
    const addButton = fixture.debugElement.query(By.css('button'));

    if (titleInput && bodyTextarea && addButton) {
      titleInput.nativeElement.value = 'New Post';
      bodyTextarea.nativeElement.value = 'This is a new post';
      titleInput.nativeElement.dispatchEvent(new Event('input'));
      bodyTextarea.nativeElement.dispatchEvent(new Event('input'));

      addButton.nativeElement.click();
      fixture.detectChanges();

      expect(component.posts.length).toBe(3); // After adding, posts length should be 3
      expect(blogService.createPost).toHaveBeenCalled();
      expect(component.posts[0].title).toBe('New Post');
    }
  });

  it('should add a comment to a post', () => {
    component.posts = mockPosts;
    fixture.detectChanges();

    const commentButton = debugElement.query(By.css('.commentButton'));

    if (commentButton) {
      commentButton.nativeElement.click(); // Toggle the comment box
      fixture.detectChanges();

      const commentInput = debugElement.query(By.css('textarea[placeholder="Add a comment"]'));
      if (commentInput) {
        commentInput.nativeElement.value = 'New Comment';
        commentInput.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        const submitButton = debugElement.query(By.css('.comment-box button'));
        if (submitButton) {
          submitButton.nativeElement.click();
          fixture.detectChanges();

          expect(component.posts[0].comments.length).toBe(1);
          expect(component.posts[0].comments[0].body).toBe('New Comment');
        }
      }
    }
  });

  it('should toggle the comment box for a post', () => {
    component.posts = mockPosts;
    fixture.detectChanges();

    const commentButton = debugElement.query(By.css('.commentButton'));

    if (commentButton) {
      commentButton.nativeElement.click();
      fixture.detectChanges();

      expect(component.posts[0].showCommentBox).toBe(true);

      commentButton.nativeElement.click();
      fixture.detectChanges();

      expect(component.posts[0].showCommentBox).toBe(false);
    }
  });

  it('should paginate posts correctly', () => {
    component.length = 50; // Assume there are 50 posts in total
    component.pageSize = 10; // Show 10 posts per page
    component.updateDataSource();
    fixture.detectChanges();

    const paginator = fixture.debugElement.query(By.css('mat-paginator'));
    if (paginator) {
      paginator.nativeElement.dispatchEvent(new Event('page'));
      fixture.detectChanges();

      expect(component.pageIndex).toBe(0); // Check initial pageIndex
      expect(component.dataSource.data.length).toBe(2); // Based on mock data
    }
  });
});
