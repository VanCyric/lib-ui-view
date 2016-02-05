// http://stackoverflow.com/questions/6157929/how-to-simulate-a-mouse-click-using-javascript

var defaultOptions, eventMatchers, extend, simulate;

simulate = function(element, eventName) {
    var eventType, evt, name, oEvent, options, _ref;
    options = extend(defaultOptions, (_ref = arguments[2]) != null ? _ref : {});
    oEvent = void 0;
    eventType = null;
    for (name in eventMatchers) {
        if (eventMatchers[name].test(eventName)) {
            eventType = name;
            break;
        }
    }
    if (!eventType) {
        throw new SyntaxError("Only HTMLEvents and MouseEvents interfaces are supported");
    }
    if (document.createEvent) {
        oEvent = document.createEvent(eventType);
        if (eventType === "HTMLEvents") {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        } else {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView, options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    } else {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent("on" + eventName, oEvent);
    }
    return element;
};

extend = function(destination, source) {
    var property;
    for (property in source) {
        destination[property] = source[property];
    }
    return destination;
};

eventMatchers = {
    HTMLEvents: /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    MouseEvents: /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
};

defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
};

module.exports = simulate;
