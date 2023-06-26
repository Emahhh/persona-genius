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
  navigator.serviceWorker.register('src/utils/serviceworker.ts')
    .then(sw => {
      console.log('ServiceWorker registration successful: ', sw);
    })
    .catch(e => {
      console.log('ServiceWorker registration failed: ', e);
    });
}




//sendNotification('Hello world!');

export default app;
