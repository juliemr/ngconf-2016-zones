import {
  fit,
  it,
  fdescribe,
  describe,
  expect,
  inject,
  beforeEach,
  beforeEachProviders,
  fakeAsync,
  tick
} from '@angular/core/testing';
import {
  ComponentFixture,
  TestComponentBuilder
} from '@angular/compiler/testing';
import { By } from '@angular/platform-browser'
import { Component, provide } from '@angular/core';

/**
 * This file shows how to use the fakeAsync helper to manually
 * control time.
 *
 * Here, we'll use Angular's test wrappers - note that we import
 * it, describe, and friends from angular's library.
 *
 * We'll also bring in some components and test actual Angular code.
 */

@Component({
  template: `
    <button (click)="start()">Start</button>
    <span>{{message}}</span>
  `
})
class RockPaperScissors {
  count: number;
  message: string;

  start() {
    this.count = 3;
    this.message = this.count.toString();

    this.next();
  }

  next() {
    setTimeout(() => {
      this.count--;
      this.message = this.count.toString();
      if (this.count == 0) {
        this.message = 'ROCK!'
      } else {
        this.next();
      }
    }, 1000);
  }
}

describe('Rock/Paper/Scissors component', () => {
  let builder;

  beforeEach(inject([TestComponentBuilder], (tcb) => {
    builder = tcb;
  }));

  it('should count down and throw rock', fakeAsync(() => {
    let fixture;
    builder.createAsync(RockPaperScissors).then((compFixture: ComponentFixture<RockPaperScissors>) => {
      fixture = compFixture;
    });
    tick();

    let output = fixture.debugElement.query(By.css('span')).nativeElement;
    fixture.debugElement.query(By.css('button')).nativeElement.click();

    fixture.detectChanges();
    expect(output.textContent).toEqual('3');

    tick(1000);
    fixture.detectChanges();
    expect(output.textContent).toEqual('2');

    tick(1000);
    fixture.detectChanges();
    expect(output.textContent).toEqual('1');

    tick(1000);
    fixture.detectChanges();
    expect(output.textContent).toEqual('ROCK!');
  }));
});
