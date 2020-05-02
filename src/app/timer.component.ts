import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { timer, Subscription } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'timer',
  template: `
  <h1 *ngIf="refreshed">
    <span>{{daysLeft}}</span><span> : </span>
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

  private INTERVAL = 1000;
  private timerSubscription: Subscription;

  public refreshed: boolean;
  public timeLeft: Date;
  public daysLeft: number;

  constructor() { }

  ngOnInit() {
    const toDateString = new Date(this.toDate).toDateString();
    const toDateTime = new Date(toDateString).getTime();
    const remainingTime = toDateTime - Date.now();

    this.timerSubscription = timer(0, this.INTERVAL).pipe(
      map((t: number) => remainingTime - t * this.INTERVAL),
      takeWhile(t => t >= 0)
    ).subscribe((time: number) => {
      this.timeLeft = new Date(time);
      this.daysLeft = parseInt((time / (1000 * 3600 * 24)).toString(), 10);
      this.refreshed = true;
    });
  }

  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
  }
}
