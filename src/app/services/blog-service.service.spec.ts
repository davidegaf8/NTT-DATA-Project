import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BlogService } from './blog-service.service';
import { Post, Comment } from 'src/models/blog.models';
import { User } from 'src/models/user.model';
import { HttpHeaders } from '@angular/common/http';

describe('BlogService', () => {
  let service: BlogService;
  let httpMock: HttpTestingController;

  const mockPosts: Post[] = [
    { id: 1, user_id: 1, title: 'Post 1', body: 'Body 1', userName: '', likes: 0, comments: [], showCommentBox: false },
    { id: 2, user_id: 1, title: 'Post 2', body: 'Body 2', userName: '', likes: 0, comments: [], showCommentBox: false },
  ];

  const mockUsers: User[] = [
    { id: 1, name: 'User 1', surname: 'Surname 1', email: 'user1@example.com', gender: 'male', status: 'active' },
    { id: 2, name: 'User 2', surname: 'Surname 2', email: 'user2@example.com', gender: 'female', status: 'inactive' },
  ];

  const mockComments: Comment[] = [
    { id: 1, postId: 1, body: 'Comment 1', user_id: 1, userName: '', replies: [] },
    { id: 2, postId: 1, body: 'Comment 2', user_id: 1, userName: '', replies: [] },
  ];

  const authToken = 'mock-token';

  beforeEach(() => {
    // Spy on localStorage.getItem before the service is created
    spyOn(localStorage, 'getItem').and.returnValue(authToken);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BlogService],
    });
    service = TestBed.inject(BlogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifies that no unmatched HTTP requests are outstanding
  });

  // Test case for getUsers method
  it('should fetch users (getUsers)', () => {
    service.getUsers().subscribe((users) => {
      expect(users.length).toBe(2);
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/users?per_page=100`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers); // Send mockUsers as the response
  });

  // Test case for getPosts method
  it('should fetch posts for a given page (getPosts)', () => {
    const page = 1;
    const pageSize = 10;

    service.getPosts(page, pageSize).subscribe((posts) => {
      expect(posts.length).toBe(2);
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/posts?page=${page}&per_page=${pageSize}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts); // Send mockPosts as the response
  });

  // Test case for getCommentsForPost method
  it('should fetch comments for a post (getCommentsForPost)', () => {
    const postId = 1;

    service.getCommentsForPost(postId).subscribe((comments) => {
      expect(comments.length).toBe(2);
      expect(comments).toEqual(mockComments);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/posts/${postId}/comments`);
    expect(req.request.method).toBe('GET');
    req.flush(mockComments); // Send mockComments as the response
  });

  // Test case for createPost method
  it('should create a new post (createPost)', () => {
    const newPost: Post = {
      id: 3,
      user_id: 1,
      title: 'New Post',
      body: 'New Body',
      userName: '',
      likes: 0,
      comments: [],
      showCommentBox: false
    };

    service.createPost(newPost).subscribe((post) => {
      expect(post).toEqual(newPost);
    });

    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/posts`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${authToken}`);
    req.flush(newPost); // Send the new post as the response
  });
});
