const socket = io();
// dom elements
const $elementForm = document.querySelector('#messageForm');
const $elementFormInput = $elementForm.querySelector('#messageInput');
const $elementFormButton = $elementForm.querySelector('button');
const $elementLocationButton = document.querySelector('#sendLocation');
const $elementMessageContainer = document.querySelector('#messages');

// templates
const $elementMessageTemplate = document.querySelector('#message-template').innerHTML;
const $elementLocationTemplate = document.querySelector('#location-template').innerHTML;

const {name, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});
socket.on('message', (message) => {
  const html = Mustache.render($elementMessageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a')
  });
  $elementMessageContainer.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (msg)=>{
  const html = Mustache.render($elementLocationTemplate, {
    url: msg.url,
    createdAt: moment(msg.createdAt).format('h:mm a')
  });
  $elementMessageContainer.insertAdjacentHTML('beforeend', html);
});


document.querySelector('#messageForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  $elementFormButton.setAttribute('disabled', 'disabled');

  const textMessage = document.getElementById('messageInput').value;
  socket.emit('messageSend', textMessage, (error) => {
    $elementFormInput.value = '';
    $elementFormInput.focus();
    $elementFormButton.removeAttribute('disabled');
    if (error) {
      return console.log(error);
    }
    console.log('Message delivered');
  });
});

document.querySelector('#sendLocation').addEventListener('click', ()=> {
  if (!navigator.geolocation) {
    console.log('Your browser doesnot support navigator');
  }
  $elementLocationButton.setAttribute('disabled', 'disabled');
  navigator.geolocation.getCurrentPosition((position)=>{
    socket.emit('SendLocation', {
      latitude: position.coords.latitude,
      longitute: position.coords.longitude
    }, (error) => {
      $elementLocationButton.removeAttribute('disabled');
      if (error) {
        return console.log(error);
      }
      console.log('Location Delivered');
    });
  });
});

socket.emit('join', {name, room}, (error)=>{
  if (error) {
    alert(error);
    location.href = '/';
  }
});
