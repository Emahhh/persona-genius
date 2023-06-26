
/**
 * Request permission to send notifications to the user.
 */
async function requestPermission() {
  Notification.requestPermission().then(function (result) {
    console.log("Notification permission: " + result);
  });
}

/**
 * Send a notification to the user. If the user has not granted permission, this will request it.
 * @param title The title of the notification.
 * @param body The body of the notification.
 */
async function send(title:string, body:string) {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notifications');
    return;
  }

  const notif: NotificationOptions = {
    body,
    icon: 'assets/pwa-icons/icon-192x192.png',
  };

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, notif);
    return;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const notification = new Notification(title, notif);
      return;
    }
  }

}


export const notifications = { requestPermission, send };
