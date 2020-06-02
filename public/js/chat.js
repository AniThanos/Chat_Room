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
const $elementSidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

const {name, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

const autoScroll = () => {

  //New Message Element
  const newMessageElement = $elementMessageContainer.lastElementChild;

  //Height of the new message
  const newMessageStyle = getComputedStyle(newMessageElement);
  const newMessageMargin = parseInt(newMessageStyle.marginBottom);
  const newMessageheight = newMessageElement.offsetHeight + newMessageMargin ;

  //visible Height
  const visibleHeight = $elementMessageContainer.offsetHeight;
  

  //height of the message container
  const containerHeight = $elementMessageContainer.scrollHeight;

  //how far I have scroll
  const scrollOffSet = $elementMessageContainer.scrollTop + visibleHeight ;

  if(containerHeight - newMessageheight <= scrollOffSet){
    $elementMessageContainer.scrollTop = $elementMessageContainer.scrollHeight;
  }
}


socket.on('message', (message) => {
  console.log(message);
  const html = Mustache.render($elementMessageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a')
  });
  $elementMessageContainer.insertAdjacentHTML('beforeend', html);
  autoScroll()
});

socket.on('roomData', ({room, users})=>{
  const html = Mustache.render($elementSidebarTemplate, {
    room,
    users
  });
  document.querySelector('#sidebar').innerHTML = html;
});

socket.on('locationMessage', (msg)=>{
  const html = Mustache.render($elementLocationTemplate, {
    username: msg.username,
    url: msg.url,
    createdAt: moment(msg.createdAt).format('h:mm a')
  });
  $elementMessageContainer.insertAdjacentHTML('beforeend', html);
  autoScroll();
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
  });
});

document.querySelector('#sendLocation').addEventListener('click', ()=> {
  if (!navigator.geolocation) {
    alert('Your browser doesnot support navigator');
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
