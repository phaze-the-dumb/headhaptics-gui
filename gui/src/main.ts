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

let setState = ( state: ConnectionState ) => {
  let indicatorLight = document.querySelector<HTMLElement>('#indicator-light')!;
  let indicatorText = document.querySelector<HTMLElement>('#indicator-text')!;

  switch ( state ) {
    case ConnectionState.NOT_CONNECTED:
      indicatorLight.style.backgroundColor = '#720000';
      indicatorLight.style.boxShadow = 'none';
      indicatorLight.style.animation = 'none';

      indicatorText.innerHTML = 'Not Connected.';
      document.querySelector<HTMLElement>('.bottom-tip')!.style.display = 'block';
      break;
    
    case ConnectionState.ERRORED:
      indicatorLight.style.backgroundColor = '#ff0000';
      indicatorLight.style.boxShadow = '#ff0000 0 0 10px';
      indicatorLight.style.animation = 'none';

      indicatorText.innerHTML = 'Error.';
      document.querySelector<HTMLElement>('.bottom-tip')!.style.display = 'none';
      break;

    case ConnectionState.SEARCHING:
      indicatorLight.style.animation = 'indicator-searching infinite linear 1s';

      indicatorText.innerHTML = 'Searching...';
      document.querySelector<HTMLElement>('.bottom-tip')!.style.display = 'none';
      break;

    case ConnectionState.CONNECTED:
      indicatorLight.style.backgroundColor = '#00aa00';
      indicatorLight.style.boxShadow = '#00aa00 0 0 10px';
      indicatorLight.style.animation = 'none';

      indicatorText.innerHTML = 'Connected.';
      document.querySelector<HTMLElement>('.bottom-tip')!.style.display = 'none';
      break;

    case ConnectionState.INSTALLING:
      indicatorLight.style.backgroundColor = '#32cc66';
      indicatorLight.style.boxShadow = '#32cc66 0 0 10px';
      indicatorLight.style.animation = 'none';

      indicatorText.innerHTML = 'Installing...';
      document.querySelector<HTMLElement>('.bottom-tip')!.style.display = 'none';
      break;
  }
}

let updateState = () => {
  fetch(endpoint + '/api/v1/state')
    .then(data => data.json())
    .then(data => {
      if(data.ok){
        setState(data.state);
      } else{
        setState(ConnectionState.ERRORED);
        console.error(data.msg);
      }
    })
    .catch(e => {
      setState(ConnectionState.ERRORED);
      console.error(e);
    })

  setTimeout(updateState, 1000);
}

document.querySelector<HTMLElement>('#runtime-link')!.onclick = () =>
  fetch(endpoint + '/api/v1/opendownloads');

document.querySelector<HTMLElement>('#minimise-button')!.onclick = () =>
  fetch(endpoint + '/api/v1/minimise');

setState(ConnectionState.NOT_CONNECTED);
updateState();