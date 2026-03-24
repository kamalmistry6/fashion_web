import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Toast, ToasterService } from './toaster.service';

@Component({
  selector: 'app-toaster',
  standalone: false,
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss'],
})
export class ToasterComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subs = new Subscription();
  private timers = new Map<number, ReturnType<typeof setTimeout>>();

  constructor(private toasterService: ToasterService) {}

  ngOnInit() {
    this.subs.add(
      this.toasterService.toast$.subscribe((toast) => {
        this.toasts.push(toast);
        this.timers.set(
          toast.id,
          setTimeout(() => this.remove(toast.id), toast.duration)
        );
      })
    );

    this.subs.add(
      this.toasterService.dismiss$.subscribe((id) => this.remove(id))
    );
  }

  remove(id: number) {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }

  icon(type: string): string {
    switch (type) {
      case 'success': return 'lucide:check-circle';
      case 'error': return 'lucide:x-circle';
      case 'warning': return 'lucide:alert-triangle';
      case 'info': return 'lucide:info';
      default: return 'lucide:info';
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.timers.forEach((t) => clearTimeout(t));
  }
}
