import { Component, HostListener, OnInit } from '@angular/core';
interface SidenavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent implements OnInit {
  isSidenavCollapsed = false; // Track sidenav state
  screenWidth = window.innerWidth;

  ngOnInit(): void {
    this.updateBodyClass();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.screenWidth = (event.target as Window).innerWidth;
    this.updateBodyClass();
  }

  onToggleSidenav(data: SidenavToggle): void {
    this.isSidenavCollapsed = data.collapsed;
    this.screenWidth = data.screenWidth;
    this.updateBodyClass();
  }

  updateBodyClass(): void {
    const content = document.querySelector('.content');
    if (content) {
      content.classList.remove('sidenav-collapsed', 'sidenav-expanded');

      if (this.isSidenavCollapsed) {
        content.classList.add('sidenav-expanded');
      } else {
        content.classList.add('sidenav-collapsed');
      }
    }
  }
}
