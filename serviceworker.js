// File needs to be stored in the root of the app.

this.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('v1').then(function(cache) {
            return cache.addAll([
                'assets/img/glowing_bear_128x128.png',
            ]);
        })
    );
});

this.addEventListener('push', function(event) {
    // If there is a tab already open we just let
    // the standard desktop notifications to go ahead
    // with the notification. We will use the push events
    // just in the case there is not tab open to spawn one
    // tab
    event.waintUntil(clients.matchAll({
        type: "window"
    })).then(function(clientList) {
        if (isClientOpen(clientList)) {
            return Promise.resolve();
        }

        var title = 'Private message';
        // event.data is an structure like:
        // {
        //   channel: 'nickname',
        //   msg: 'the message'
        // }
        var json = event.data.json();
        var msg = json.channel + ': ' + json.msg;

        self.registration.showNotification(title, {
          body: msg,
          icon: 'assets/img/favicon.png',
          tag: 'pvt-tag'
        });
    });
    
});

this.onnotificationclick = function(event) {
    // Android doesn't close the notification when you click on it
    // See: http://crbug.com/463146
    event.notification.close();

    event.waitUntil(clients.openWindow(self.registration.scope));
};

/**
 * Helper function tell us if there is already
 * a tab open being controlled by the serviceworker
 */
function isClientOpen(clients) {
  var origin = self.registration.scope;
  return clients.find(function(client) {
    return client.url.indexOf(origin) == 0;
  }) != null;
}
