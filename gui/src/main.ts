import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

let endpoint = 'http://127.0.0.1:46704';

createApp(App).mount('#app');

enum ConnectionState{
  NOT_CONNECTED,
  CONNECTED,
  ERRORED,
  SEARCHING,
  INSTALLING
}

let currentState: ConnectionState = ConnectionState.NOT_CONNECTED;

let setState = ( state: ConnectionState ) => {
  let indicatorLight = document.querySelector<HTMLElement>('#indicator-light')!;
  let indicatorText = document.querySelector<HTMLElement>('#indicator-text')!;

  currentState = state;

  switch ( state ) {
    case ConnectionState.NOT_CONNECTED:
      indicatorLight.style.backgroundColor = '#720000';
      indicatorLight.style.boxShadow = 'none';

      indicatorText.innerHTML = 'Not Connected.';
      break;
    
    case ConnectionState.ERRORED:
      indicatorLight.style.backgroundColor = '#ff0000';
      indicatorLight.style.boxShadow = '#ff0000 0 0 10px';

      indicatorText.innerHTML = 'Error.';
      break;

    case ConnectionState.SEARCHING:
      indicatorLight.style.animation = 'indicator-searching infinite linear 1s';

      indicatorText.innerHTML = 'Searching...';
      break;

    case ConnectionState.CONNECTED:
      indicatorLight.style.backgroundColor = '#00aa00';
      indicatorLight.style.boxShadow = '#00aa00 0 0 10px';

      indicatorText.innerHTML = 'Connected.';
      break;

    case ConnectionState.INSTALLING:
      indicatorLight.style.backgroundColor = '#32cc66';
      indicatorLight.style.boxShadow = '#32cc66 0 0 10px';

      indicatorText.innerHTML = 'Installing...';
      break;
  }
}

document.querySelector<HTMLElement>('#detect-devices-btn')!.onclick = () => {
  document.querySelector<HTMLElement>('.waiting-for-backend')!.style.display = 'block';

  fetch(endpoint + '/api/v1/detect')
    .then(data => data.json())
    .then(data => {
      if(data.ok){
        document.querySelector<HTMLElement>('.waiting-for-backend')!.style.display = 'none';
        setState(ConnectionState.SEARCHING);
      } else{
        document.querySelector<HTMLElement>('.waiting-for-backend')!.style.display = 'none';
        setState(ConnectionState.ERRORED);

        console.error(data.msg);
      }
    })
    .catch(e => {
      document.querySelector<HTMLElement>('.waiting-for-backend')!.style.display = 'none';
      setState(ConnectionState.ERRORED);

      console.error(e);
    })
}

let updateState = () => {
  document.querySelector<HTMLElement>('.waiting-for-backend')!.style.display = 'block';

  fetch(endpoint + '/api/v1/state')
    .then(data => data.json())
    .then(data => {
      if(data.ok){
        document.querySelector<HTMLElement>('.waiting-for-backend')!.style.display = 'none';
        setState(data.state);
      } else{
        document.querySelector<HTMLElement>('.waiting-for-backend')!.style.display = 'none';
        setState(ConnectionState.ERRORED);

        console.error(data.msg);
      }
    })
    .catch(e => {
      document.querySelector<HTMLElement>('.waiting-for-backend')!.style.display = 'none';
      setState(ConnectionState.ERRORED);

      console.error(e);
    })

  setTimeout(updateState, 1000);
}

setState(ConnectionState.NOT_CONNECTED);