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
    var title = 'Private message';
    // event.data is an structure like:
    // {
    //   channel: 'nickname',
    //   msg: 'the message'
    // }
    var json = event.data.json();
    var msg = json.channel + ': ' + json.msg;
    event.waitUntil(
        self.registration.showNotification(title, {
          body: msg,
          icon: 'assets/img/favicon.png',
          tag: 'pvt-tag'
        }));
});

this.onnotificationclick = function(event) {
    // Android doesn't close the notification when you click on it
    // See: http://crbug.com/463146
    event.notification.close();

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(clients.matchAll({
        type: "window"
    }).then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if ('focus' in client) {
                return client.focus();
            }
        }
        /*
        if (clients.openWindow) {
            return clients.openWindow('/glowing-bear/');
        }
        */
    }));
};
