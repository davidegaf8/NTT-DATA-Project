import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { UsersComponent } from './users.component';
import { User } from 'src/models/user.model';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersComponent],
      imports: [
        HttpClientTestingModule,
        MatPaginatorModule,
        MatTableModule,
        MatDialogModule,
        MatIconModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule
      ],
      providers: [MatDialog]
    }).compileComponents();
  });

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let httpMock: HttpTestingController;
  let dialogSpy: jasmine.Spy;
  let dialog: MatDialog;

  const mockUsers: User[] = [
    {
      id: 1, name: 'John Doe', email: 'john@example.com', gender: 'male', status: 'active',
      surname: ''
    },
    {
      id: 2, name: 'Jane Doe', email: 'jane@example.com', gender: 'female', status: 'active',
      surname: ''
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersComponent],
      imports: [
        HttpClientTestingModule,
        MatPaginatorModule,
        MatTableModule,
        MatDialogModule,
        RouterTestingModule.withRoutes([]), // Simulate routing for user detail
      ],
      providers: [MatDialog]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    dialog = TestBed.inject(MatDialog);

    dialogSpy = spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of({ id: 3, name: 'New User', email: 'new@example.com' })
    } as any); // Mock the dialog behavior

    fixture.detectChanges(); // Trigger ngOnInit
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch users and initialize the table', () => {
    // Simulate multiple paginated API calls
    const reqs = [];
    for (let i = 1; i <= 5; i++) {
      reqs.push(httpMock.expectOne(`https://gorest.co.in/public/v2/users?page=${i}&per_page=20`));
    }
  
    // Respond with mock user data
    reqs.forEach((req, index) => {
      req.flush([mockUsers[index % mockUsers.length]]); // Return mock data
    });
  
    fixture.detectChanges();
  
    // Verify data is set correctly in the table
    expect(component.dataSource.data.length).toBeGreaterThan(0);
    expect(component.dataSource.data).toEqual(mockUsers);
  
    // Finally, verify that there are no outstanding requests
    httpMock.verify(); 
  });
  

  it('should filter users based on the search query', () => {
    component.dataSource.data = mockUsers;
    fixture.detectChanges();

    // Simulate search input
    component.applyFilter({ target: { value: 'john' } } as unknown as Event);
    fixture.detectChanges();

    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].name).toContain('John');
  });

  it('should clear search and reset the filter', () => {
    const input = document.createElement('input');
    input.value = 'john';

    // Apply a filter and check that the list is filtered
    component.applyFilter({ target: input } as unknown as Event);
    expect(component.dataSource.filteredData.length).toBe(1);

    // Clear the filter and check if the data is reset
    component.clearSearch(input);
    expect(component.dataSource.filteredData.length).toBe(2);
  });

  it('should delete a user from the table', () => {
    component.dataSource.data = [...mockUsers];
    fixture.detectChanges();

    // Call the deleteUser method
    component.deleteUser(mockUsers[0]);
    fixture.detectChanges();

    // Verify the user is removed
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].name).toBe('Jane Doe');
  });

  it('should open add user dialog and add a new user to the table', fakeAsync(() => {
    component.dataSource.data = [...mockUsers];
    fixture.detectChanges();

    // Open the dialog to add a new user
    component.openAddUserDialog();
    tick(); // Simulate asynchronous behavior

    // Check if the dialog was opened and returned a result
    expect(dialogSpy).toHaveBeenCalled();
    fixture.detectChanges();

    // Verify the new user is added to the table
    expect(component.dataSource.data.length).toBe(3);
    expect(component.dataSource.data[0].name).toBe('New User');
  }));

  it('should navigate to user detail', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    // Call the openUserDetail method
    component.openUserDetail(mockUsers[0]);

    // Verify that the router's navigate method was called with correct route
    expect(routerSpy).toHaveBeenCalledWith(['/user', mockUsers[0].id]);
  });
});
