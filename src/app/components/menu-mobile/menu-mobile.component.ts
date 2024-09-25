import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ToggleMenuService } from 'src/app/services/toggle-menu.service';

@Component({
  selector: 'app-menu-mobile',
  templateUrl: './menu-mobile.component.html',
  styleUrls: ['./menu-mobile.component.css']
})
export class MenuMobileComponent implements OnInit {
  isToggled!: boolean;

  constructor(private toggleMenuService:ToggleMenuService, private authService: AuthService, private router: Router) {} 
  
  ngOnInit(): void {
   
  }

  closeMenu() {
    this.toggleMenuService.toggleMenu().subscribe(isToggled => {
      this.isToggled = isToggled;
    });
  }

  onLogout() {
    this.authService.logOut();
    this.router.navigate(['login']);
    localStorage.clear();
  }
}
