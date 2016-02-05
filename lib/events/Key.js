var Events = {
    /**
     Событие нажатия на клавишу с обратным вызовом

     @event 'keypress:callback'
     @param {Object} event Событие
     @param {String} event.keyId Нажатая клавиша
     @param {View} event.target Представление, на котором произошло нажатие клавиши
     @param {Object} event.originalEvent Первоначальное событие DOM
     @param {Boolean} event.bubbling Флаг всплывающего события
     @param {Function} callback Функция обратного вызова
     @for View
     @final
     @since 1.0.0
     */
    KEY_CB: 'keypress:callback',

    /**
     Событие нажатия на клавишу

     @event 'keypress'
     @param {Object} event Событие
     @param {String} event.keyId Нажатая клавиша
     @param {View} event.target Представление, на котором произошло нажатие клавиши
     @param {Object} event.originalEvent Первоначальное событие DOM
     @param {Boolean} event.bubbling Флаг всплывающего события
     @for View
     @final
     @since 1.0.0
     */
    KEY_PRESS: 'keypress'
};

/**
 Событие нажатия на клавишу

 @event 'keypress'
 @param {Object} event Событие
 @param {String} event.keyId Нажатая клавиша
 @param {View} event.target Представление, на котором произошло нажатие клавиши
 @param {Object} event.originalEvent Первоначальное событие DOM
 @param {Boolean} event.bubbling Флаг всплывающего события
 @for ViewManager
 @final
 @since 1.0.0
 */
Events['KEY_PRESS_VM'] = Events['KEY_PRESS'];

module.exports = Events;
