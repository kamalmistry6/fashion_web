import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToasterService {
  private counter = 0;
  private toastSubject = new Subject<Toast>();
  private dismissSubject = new Subject<number>();

  toast$ = this.toastSubject.asObservable();
  dismiss$ = this.dismissSubject.asObservable();

  success(message: string, duration = 4000) {
    this.show('success', message, duration);
  }

  error(message: string, duration = 5000) {
    this.show('error', message, duration);
  }

  warning(message: string, duration = 4000) {
    this.show('warning', message, duration);
  }

  info(message: string, duration = 4000) {
    this.show('info', message, duration);
  }

  dismiss(id: number) {
    this.dismissSubject.next(id);
  }

  private show(type: ToastType, message: string, duration: number) {
    this.toastSubject.next({ id: ++this.counter, type, message, duration });
  }
}
