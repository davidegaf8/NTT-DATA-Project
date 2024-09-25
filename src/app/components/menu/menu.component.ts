import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ToggleMenuService } from 'src/app/services/toggle-menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  isMobile: boolean = false;
  isToggled: boolean = false;

  constructor(
    private toggleMenuService: ToggleMenuService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkWindowWidth();
    window.addEventListener('resize', () => {
      this.checkWindowWidth();
    });
  }

  checkWindowWidth() {
    if (window.innerWidth < 800) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  onToggleMenu() {
    this.toggleMenuService.toggleMenu().subscribe((isToggled) => {
      this.isToggled = isToggled;
    });
  }

  onLogout() {
    this.authService.logOut();
    this.router.navigate(['login']);
    localStorage.clear();
  }
}
