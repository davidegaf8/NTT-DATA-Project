import { Observable, Subject } from 'rxjs';

export class ToggleMenuService {
  private toggleSubject = new Subject<boolean>();
  isToggled: boolean = false;

  toggleMenu(): Observable<boolean> {
    this.isToggled = !this.isToggled;
    this.toggleSubject.next(this.isToggled);
    return this.toggleSubject.asObservable();
  }
}      