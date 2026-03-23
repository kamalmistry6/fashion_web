import {
  Component,
  EventEmitter,
  HostListener,
  Output,
  OnInit,
} from '@angular/core';
import { navbarData } from './nav-data';
import { Router } from '@angular/router';

interface sidenavToggle {
  screenWidth: number;
  collapsed: boolean;
}

interface NavbarItem {
  RouterLink: string;
  iconName: string;
  label: string;
}

@Component({
  selector: 'app-sidenav',
  standalone: false,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  @Output() onToggleSidenav: EventEmitter<sidenavToggle> = new EventEmitter();

  collapsed = false;
  screenWidth = window.innerWidth;
  navData = navbarData;

  constructor(private router: Router) {}

  @HostListener('window:resize')
  onResize() {
    this.screenWidth = window.innerWidth;

    if (this.screenWidth < 768) {
      this.collapsed = false;
      this.emit();
    }
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.emit();
  }

  closeSidenav() {
    this.collapsed = false;
    this.emit();
  }

  logout() {
    this.router.navigate(['/login']);
  }

  private emit() {
    this.onToggleSidenav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }
}
