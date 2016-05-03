function init() {
  var westButton = document.querySelector('#westbutton');
  var eastButton = document.querySelector('#eastbutton');

  var westZone = Zone.current.fork({
    name: 'West zone'
  });

  var eastZone = Zone.current.fork({
    name: 'East zone'
  });

  function handleClick() {
    console.log('click from zone: ' + Zone.current.name);
  }

  westZone.run(function() {
    westButton.onclick = handleClick;
  });

  eastZone.run(function() {
    eastButton.onclick = handleClick;
  });
}
