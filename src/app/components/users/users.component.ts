import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/models/user.model';

const users: User[] = []

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'email', 'delete'];
  dataSource = new MatTableDataSource<User>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  totalUsers = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(private http: HttpClient, private dialog:MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator.page.subscribe((event: PageEvent) => {
      this.pageSize = event.pageSize;
      this.currentPage = event.pageIndex;
      this.fetchUsers();
    });
  }

  fetchUsers(): void {
    const usersToFetch = 100;
    const requests = [];
    const perPage = 20; // Maximum per page, you may change if the API allows more

    for (let i = 1; i <= Math.ceil(usersToFetch / perPage); i++) {
      requests.push(this.http.get<User[]>(`https://gorest.co.in/public/v2/users?page=${i}&per_page=${perPage}`));
    }

    forkJoin(requests).subscribe(responses => {
      const allUsers = responses.flat();
      this.dataSource.data = allUsers.slice(0, usersToFetch);
      this.totalUsers = allUsers.length; // If the total number of users is not known
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearSearch(input: HTMLInputElement): void {
    input.value = '';
    this.dataSource.filter = '';
  }

  deleteUser(user: User): void {
    const index = this.dataSource.data.indexOf(user);
    if (index >= 0) {
      this.dataSource.data.splice(index, 1);
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.dataSource.paginator = this.paginator;
    }
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.data.unshift(result);
        this.dataSource = new MatTableDataSource(this.dataSource.data);
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  openUserDetail(user: User): void {
    this.router.navigate(['/user', user.id]);
  }
}