import {Component, NgZone, provide} from '@angular/core';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES, Routes, Route} from '@angular/router';

import {bootstrap} from '@angular/platform-browser-dynamic';

/**
 * See how you can control angular change detection by using
 * NgZone to run processing outside of the Angular Zone.
 */
@Component({
  selector: 'zone-demo',
  template: `
    <div>Progress: {{progress}}</div>
    <button (click)="go()">Go</button>
    <button (click)="goOutsideAngular()">Go (outside Angular Zone)</button>
    <div><p class="note">Open console to see progress</div>`
})
class NgZoneDemoComponent {
  progress: number = 0;
  constructor(public ngZone: NgZone) {}

  increaseProgress(doneCallback: () => void) {
    this.progress += 1;
    console.log('progress: ' + this.progress);
    if (this.progress < 100) {
      window.setTimeout(() => this.increaseProgress(doneCallback), 10)
    } else {
      doneCallback();
    }
  }

  go() {
    this.progress = 0;
    this.increaseProgress(() => {});
  }

  goOutsideAngular() {
    this.progress = 0;
    this.ngZone.runOutsideAngular(() => {
      this.increaseProgress(() => {
        this.ngZone.run(() => {
          console.log('Done!');
        });
      });
    });
  }
}

/**
 * See how you can use NgZone to control what end to end testing waits for.
 *
 * Try running the follow command in the console to see how Protractor
 * would wait for stability:
 *
 * window.getAngularTestability(document.querySelector('my-carousel')).whenStable(function() {console.log('Stable!')});
 */
@Component({
  selector: 'my-carousel',
  template: `
    <h3>{{content[index]}}</h3>
    <button (click)="start()">Start</button>
    <button (click)="startTestFriendly()">Start (test friendly)</button>
    <button (click)="stop()" [disabled]="intervalId == 0">Stop</button>
    <div>
      <p class="note">Try copying this into the console to see how Protractor would test for stability:
      window.getAngularTestability(document.querySelector('my-carousel')).whenStable(function() {console.log('Stable!')});
    </div>`
})
class CarouselComponent {
  index: number = 0;
  content: Array<string> = [
    'Welcome!',
    'Our stuff is the best',
    'Kittens with yarn!',
    'Inspirational quote'
  ];
  intervalId: any = 0;

  constructor(public ngZone: NgZone) {}

  start() {
    this.intervalId = setInterval(() => {
      this.index = (this.index + 1) % this.content.length;
    }, 1000);
  }

  startTestFriendly() {
    // Run the set interval outside of Angular so that
    // testability will report stable.
    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        // We need to re-enter the Angular zone, or else
        // the binding will never update.
        this.ngZone.run(() => {
          this.index = (this.index + 1) % this.content.length;
        });
      }, 1000);
    });
  }

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = 0;
  }
}

@Component({
  selector: 'demo-app',
  template: `
    <a [routerLink]="['/']">Zone Demo</a>
    <a [routerLink]="['./carousel']">Carousel</a>
    <hr>
    <router-outlet>`,
  directives: [ROUTER_DIRECTIVES]
})
@Routes([
  new Route({ path: '/', component: NgZoneDemoComponent }),
  new Route({ path: 'carousel', component: CarouselComponent }),
])
class EntryComp {

}

bootstrap(EntryComp, [ROUTER_PROVIDERS, provide(LocationStrategy, { useClass: HashLocationStrategy })]);
