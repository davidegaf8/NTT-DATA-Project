import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserDetailComponent } from './user-detail.component';
import { User } from 'src/models/user.model';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    gender: 'male',
    status: 'active',
    surname: ''
  };

  const mockPosts = [
    {
      id: 1,
      title: 'Post 1',
      body: 'This is post 1 body.',
      userId: 1,
    },
    {
      id: 2,
      title: 'Post 2',
      body: 'This is post 2 body.',
      userId: 1,
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserDetailComponent],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1', // Simulate 'id' being 1 in the route
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // Trigger ngOnInit
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    // Simulate the API returning mock user data
    const reqUser = httpMock.expectOne('https://gorest.co.in/public/v2/users/1');
    reqUser.flush(mockUser);

    // Simulate the API returning mock post data
    const reqPosts = httpMock.expectOne('https://gorest.co.in/public/v2/posts?user_id=1');
    reqPosts.flush(mockPosts);

    expect(component).toBeTruthy();
  });

  it('should fetch user and posts on init', () => {
    // Expect an HTTP call for user
    const reqUser = httpMock.expectOne('https://gorest.co.in/public/v2/users/1');
    expect(reqUser.request.method).toBe('GET');
    reqUser.flush(mockUser); // Simulate the API returning mock user data

    // Expect an HTTP call for posts
    const reqPosts = httpMock.expectOne('https://gorest.co.in/public/v2/posts?user_id=1');
    expect(reqPosts.request.method).toBe('GET');
    reqPosts.flush(mockPosts); // Simulate the API returning mock post data

    // Check that the user and posts are set correctly
    expect(component.user).toEqual(mockUser);
    expect(component.posts.length).toBe(2);
  });

  it('should toggle showPosts when togglePosts is called', () => {
    // Simulate the API returning mock user data
    const reqUser = httpMock.expectOne('https://gorest.co.in/public/v2/users/1');
    reqUser.flush(mockUser);

    // Simulate the API returning mock post data
    const reqPosts = httpMock.expectOne('https://gorest.co.in/public/v2/posts?user_id=1');
    reqPosts.flush(mockPosts);

    expect(component.showPosts).toBe(false);

    component.togglePosts();
    expect(component.showPosts).toBe(true);

    component.togglePosts();
    expect(component.showPosts).toBe(false);
  });

  it('should call goBack when goBack is called', () => {
    // Simulate the API returning mock user data
    const reqUser = httpMock.expectOne('https://gorest.co.in/public/v2/users/1');
    reqUser.flush(mockUser);

    // Simulate the API returning mock post data
    const reqPosts = httpMock.expectOne('https://gorest.co.in/public/v2/posts?user_id=1');
    reqPosts.flush(mockPosts);

    spyOn(window.history, 'back');
    component.goBack();
    expect(window.history.back).toHaveBeenCalled();
  });
});
