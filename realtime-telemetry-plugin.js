/**
 * Basic Realtime telemetry plugin using websockets.
 */
function RealtimeTelemetryPlugin() {
    return function (openmct) {
        var socket = new WebSocket(location.origin.replace(/^http/, 'ws') + '/realtime/');
        var listener = {};

        socket.onmessage = function (event) {
            point = JSON.parse(event.data);
            console.log(point);
            if (listener[point.id]) {
                listener[point.id](point);
                // console.log('listener =', listener[point.id](point));
            }
        };

        var provider = {
            supportsSubscribe: function (domainObject) {
                return domainObject.type === 'example.telemetry';
            },
            subscribe: function (domainObject, callback) {
                console.log('subscribed');
                listener[domainObject.identifier.key] = callback;
                console.log(callback);
                socket.send('subscribe ' + domainObject.identifier.key);
                console.log(socket.send('subscribe ' + domainObject.identifier.key));
                return function unsubscribe() {
                    delete listener[domainObject.identifier.key];
                    socket.send('unsubscribe ' + domainObject.identifier.key);
                };
            }
        };

        openmct.telemetry.addProvider(provider);
    }
}
