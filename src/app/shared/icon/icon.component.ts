import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: false,
  template: `
    <iconify-icon
      [attr.icon]="icon"
      [style.font-size]="size"
      [style.color]="color"
    ></iconify-icon>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
      }
    `,
  ],
})
export class IconComponent {
  @Input({ required: true }) icon!: string;
  @Input() size = '1rem';
  @Input() color?: string;
}
