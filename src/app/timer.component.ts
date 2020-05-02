import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { timer, Subscription } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { getLocaleDateFormat, FormatWidth } from '@angular/common';

@Component({
  selector: 'timer',
  template: `
  <h1 *ngIf="refreshed">
    <span>{{daysLeft | number:'2.0' }}</span><span> : </span>
    <span>{{timeLeft | date:'HH':'UTC'}}</span><span> : </span>
    <span>{{timeLeft | date:'mm':'UTC'}}</span><span> : </span>
    <span>{{timeLeft | date:'ss':'UTC'}}</span>
  </h1>
  <p>
    <span>day</span>
    <span>hour</span>
    <span>min</span>
    <span>sec</span>
  </p>
  `,
  styles: [`
    h1, p { 
      display: flex;
      justify-content: space-between;
    }`
  ]
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input() toDate: string;
  @Output() expired = new EventEmitter();

  private INTERVAL = 1000;
  private timerSubscription: Subscription;

  public refreshed: boolean;
  public timeLeft: Date;
  public daysLeft: number;

  constructor() { }

  ngOnInit() {
    const toDateString = new Date(this.toDate).toISOString();
    const toDateTime = new Date(toDateString).getTime();
    const currentDateString = new Date().toISOString();
    const currentDateTime = new Date(currentDateString).getTime();

    if (currentDateTime < toDateTime) {
      this.initChrono(toDateTime - currentDateTime);
    } else {
      this.daysLeft = 0;
      this.timeLeft = new Date(0);
      this.expired.emit();
    }
  
    this.refreshed = true;
  }

  private initChrono(remainingTime: number) {
    this.timerSubscription = timer(0, this.INTERVAL).pipe(
      map((t: number) => remainingTime - t * this.INTERVAL),
      takeWhile(t => t >= 0)
    ).subscribe((time: number) => {
      this.timeLeft = new Date(time);
      this.daysLeft = parseInt((time / (1000 * 3600 * 24)).toString(), 10);
      if (time < 1000) {
        this.expired.emit();
        this.unsubscribeTimer();
      }
    });
  }

  private unsubscribeTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.unsubscribeTimer();
  }
}
