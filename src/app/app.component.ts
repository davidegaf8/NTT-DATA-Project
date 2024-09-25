import { Component, OnInit } from '@angular/core';
import { ToggleMenuService } from './services/toggle-menu.service';
import { AuthService } from './auth/auth.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'CityImpact';
  isToggled: boolean = false;
  isUsersComponent: boolean = false;

  constructor(
    private toggleMenuService: ToggleMenuService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.toggleMenuService.toggleMenu().subscribe((isToggled) => {
      this.isToggled = isToggled;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const routePath = event.urlAfterRedirects;
        this.isUsersComponent = routePath.includes('/users');
        window.scrollTo(0, 0);
      }
    });
  }
}
