import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  public endDate = '2020-05-03T01:13:59';

  public timeExpired() {
    console.info('Time expired!');
  }
}
