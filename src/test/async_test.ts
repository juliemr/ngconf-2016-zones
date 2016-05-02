import {
  fit,
  it,
  xit,
  fdescribe,
  describe,
  expect,
  inject,
  async,
  beforeEach,
  beforeEachProviders
} from '@angular/core/testing';
import {
  ComponentFixture,
  TestComponentBuilder
} from '@angular/compiler/testing';
import { By } from '@angular/platform-browser'
import { Injectable, Component, provide } from '@angular/core';

/**
 * This file shows how to use a ZoneSpec to automatically run unit
 * tests until all tasks they trigger have completed.
 *
 * Here, we'll use Angular's test wrappers - note that we import
 * it, describe, and friends from angular's library.
 *
 * We'll also bring in some components and test actual Angular code.
 */

@Injectable()
class WeatherService {
  getTemp(zip: number) {
    // Call out to our very slow and accurate weather API.
    console.log('making a new promise');
    return new Promise((resolve, reject) => {
      console.log('setting timeout');
      setTimeout(() => {
        resolve(zip == 84111 ? 70 : 60);
      }, 10);
    });
  }
}

@Component({
  template: `
    <label for="w-zip">Zip</label>
    <input id="w-zip" type="number" #zip/>
    <button (click)="getWeather(zip.value)">Go</button>
    <span *ngIf="tempDegrees">{{tempDegrees}}</span>
  `
})
class WeatherWidget {
  tempDegrees: number;

  constructor(private _weather: WeatherService) { };

  getWeather(zip: number) {
    this._weather.getTemp(zip).then((degrees: number) => {
      this.tempDegrees = degrees;
    });
  }
}

describe('weather app', () => {
  var builder;

  beforeEachProviders(() => [
    WeatherService
  ]);

  beforeEach(inject([TestComponentBuilder], (tcb) => {
    builder = tcb;
  }));

  describe('weather service', () => {
    it('should get the temperature', async(inject([WeatherService], (weather: WeatherService) => {
      weather.getTemp(84111).then((temp) => {
        expect(temp).toEqual(70);
      });

      weather.getTemp(98109).then((temp) => {
        expect(temp).toEqual(60);
      });
    })));
  });

  describe('weather component', () => {
    it('should show temperature', async(() => {
      builder.createAsync(WeatherWidget).then((fixture: ComponentFixture<WeatherWidget>) => {
        fixture.debugElement.query(By.css('#w-zip')).nativeElement.value = '84111';
        fixture.debugElement.query(By.css('button')).nativeElement.click();

        setTimeout(() => {
          expect(fixture.debugElement.query(By.css('span')).nativeElement.text).toEqual('70');
        }, 200);
      });
    }));

    fit('should show temperature - 2', async(() => {
      builder.createAsync(WeatherWidget).then((fixture: ComponentFixture<WeatherWidget>) => {
        fixture.autoDetectChanges();
        fixture.debugElement.query(By.css('#w-zip')).nativeElement.value = '84111';
        fixture.debugElement.query(By.css('button')).nativeElement.click();

        console.log('calling whenStable');
        fixture.whenStable().then((waited) => {
          expect(waited).toBe(true);
          expect(fixture.debugElement.query(By.css('span')).nativeElement.text).toEqual('70');
        });
      });
    }));
  });
});
