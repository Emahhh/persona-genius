import './app/app.css'
import App from './app/App.svelte'
import { notifications } from './utils/notifications';

const app = new App({
  target: document.getElementById('app')!,
})

// request permission to send notifications immediately on page load
notifications.requestPermission();


// register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworker.js')
    .then(sw => {
      console.log('ServiceWorker registration successful: ', sw);
      // sw.addEventListener('message', event => {
      //   console.log('Received a message from service worker: ', event.data);
      // }
    })
    .catch(e => {
      console.log('ServiceWorker registration failed: ', e);
    });
} else {
  console.log('ServiceWorkers are not supported in this browser');
}




//sendNotification('Hello world!');

export default app;
