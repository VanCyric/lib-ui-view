var KeyEvents = require('../events/Key');

/**
 Менеджер событий нажатия клавиш

 @class KeyHandlers
 @constructor
 @param {View} view Представление, к которому будет привязан менеджер
 @since 1.0.0
 */
function KeyHandlers(view) {
    /**
     Набор обработчиков для различных клавиш

     @property _handlers
     @type Object
     @default {}
     @private
     @since 1.0.0
     */
    this._handlers = {};

    /**
     Представление, к которому привязан менеджер

     @property _view
     @type View
     @default null
     @writeOnce
     @private
     @since 1.0.0
     */
    this._view = null;

    if (view != null) {
        this._view = view;
        this._view.on(KeyEvents['KEY_CB'], this._handleKeypress, this);
    }
}

/**
 Осуществляет вызов обработчиков для события, основываясь на нажатой клавише;
 Также генерирует события на представлении

 @method _handlerKeypress
 @param {Object} event Событие
 @param {String} event.keyId Нажатая клавиша
 @param {View} event.target Представление, на котором произошло нажатие клавиши
 @param {Object} event.originalEvent Первоначальное событие DOM
 @param {Boolean} event.bubbling Флаг всплывающего события
 @param {Function} callback Функция обратного вызова
 @private
 @since 1.0.0
 */
KeyHandlers.prototype._handleKeypress = function (event, callback) {
    var key = event.keyId,
        self = this,
        context,
        handler;

    if (this._handlers[key] != null) {
        this._handlers[key].forEach(function (keyHandler) {
            context = keyHandler[1];
            handler = keyHandler[0];

            handler.call(context != null ? context : self._view, event);
        });
    }

    if (this._view != null) {
        this._view.trigger(KeyEvents['KEY_PRESS'], event);
        this._view.trigger('keypress:' + key, event);
    }

    callback();
};

/**
 Добавляет обработчики для указанных клавиш

 @method add
 @param {String} keys Список клавиш, разделенных пробелом
 @param {Function} handler Обрыботчик для клавиш
 @param {View} [context=null] Контекст обработчика
 @throws {Error} Не указан список клавиш
 @throws {Error} Не указан обработчик
 @since 1.0.0
 */
KeyHandlers.prototype.add = function (keys, handler, context) {
    var keysToArray,
        handlers = this._handlers,
        self = this;

    if (context == null) {
        context = null;
    }

    if (keys != null) {
        if ((handler != null) && typeof handler === 'function') {
            keysToArray = keys.split(' ');
            keysToArray.forEach(function (key) {
                if (handlers[key] == null) {
                    handlers[key] = [];
                }
                self._handlers[key].push([handler, context]);
            });
        } else {
            throw new Error('KeyHandlers.add: handler is required');
        }
    } else {
        throw new Error('KeyHandlers.add: keys are required');
    }
};

/**
 Удаляет обработчики по заданным критериям: клавиша, обработчик, контекст

 @method remove
 @param {String} [keys=null] Список клавиш, для которых следует удалить обработчики
 @param {Function} [callback=null] Обработчик, который следует удалить
 @param {View} [context=null] Контекст, для которого следует удалить обработчик
 @since 1.0.0
 */
KeyHandlers.prototype.remove = function (keys, callback, context) {
    var key,
        keysToArray,
        handlers = this._handlers,
        self = this;

    if (keys != null) {
        keysToArray = keys.split(' ');
    } else {
        keysToArray = [];
        for (key in handlers) {
            if (!handlers.hasOwnProperty(key)) continue;
            keysToArray.push(key);
        }
    }

    keysToArray.forEach(function (key) {
        var handler, filteredHandlers, index, i, length, resultCb, resultScope;
        
        filteredHandlers = self._handlers[key].filter(function (handler) {
            resultCb = true;
            resultScope = true;

            if (callback != null) {
                resultCb = handler[0] === callback;
            }

            if (context != null) {
                resultScope = handler[1] === context;
                if (context === self._view) {
                    resultScope = resultScope || handler[1] === null;
                }
            }

            return resultCb && resultScope;
        });

        length = filteredHandlers.length;

        for (i = 0, length; i < length; i++) {
            handler = filteredHandlers[i];
            index = self._handlers[key].indexOf(handler);
            self._handlers[key].splice(index, 1);
        }

        if (self._handlers[key].length === 0) {
            self._handlers[key] = null;
        }
    });
};

/**
 Убирает все ссылки внутри менеджера, оставляя его наедине со сборщиком мусора

 @method destroy
 @since 1.0.0
 */
KeyHandlers.prototype.destroy = function () {
    this._view.off(null, null, this);
    this.remove();
    delete this._view;
    delete this._handlers;
};

module.exports = KeyHandlers;
