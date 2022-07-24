import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InfiniteScrollingService {
  private intersectionSubject = new BehaviorSubject<boolean>(false);
  public intersectionOptions = {
    root: null, //implies the root is the document viewport
    rootMargin: '0px',
    threshold: [0, 0.5, 1],
  };
  private observer: any = new IntersectionObserver(
    this.intersectionCallback.bind(this),
    this.intersectionOptions
  );
  getObservable() {
    return this.intersectionSubject.asObservable();
  }
  intersectionCallback(entries: any[], observer: any) {
    entries.forEach((entry) => {
      entry.intersectionRatio === 1
        ? this.intersectionSubject.next(true)
        : this.intersectionSubject.next(false);
    });
  }
  setObserver() {
    return this.observer;
  }
}
