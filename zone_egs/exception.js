function init() {
  var errorShortStackButton = document.querySelector('#errorshortstack');
  var errorLongStackButton = document.querySelector('#errorlongstack');

  function throwOnClick() {
    throw new Error('Don\'t click that button!');
  }

  var printErrorZone = Zone.current.fork({
    onHandleError(delegate, currentZone, targetZone, error) {
      console.log(error.stack);
    }
  });

  var longStackTraceSpec = Zone['longStackTraceZoneSpec'];

  var trackErrorZone = printErrorZone.fork(longStackTraceSpec);

  trackErrorZone.run(function() {
    errorLongStackButton.onclick = throwOnClick;
  });

  printErrorZone.run(function() {
    errorShortStackButton.onclick = throwOnClick;
  });
}
