/**
 * This file shows how to use a ZoneSpec to ensure that tests do not
 * schedule asynchronous events.
 *
 * Here, we do not use any helpers from Angular - we'll build the spec
 * ourselves with plain old Jasmine.
 */

describe('code that runs in one turn', () => {
  let SyncTestZoneSpec = (<any>window).Zone['SyncTestZoneSpec'];
  var syncZoneSpec = new SyncTestZoneSpec();
  let testZone = (<any>window).Zone.current.fork(syncZoneSpec);

  it('should do simple tests', () => {
    testZone.run(() => {
      expect(4).toEqual(4);
    });
  });

  it('should pass through errors (this should fail)', () => {
    testZone.run(() => {
      expect(4).toEqual(7);
    });
  });

  it('should dissallow asynchronous code (this should fail)', () => {
    testZone.run(() => {
      setTimeout(() => {
        console.log('made it here');
        expect(4).toEqual(4);
      }, 10);
    });
  });
});
