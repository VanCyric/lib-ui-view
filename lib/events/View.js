module.exports = {
    /**
     Событие нажатия клавиши enter или клика по представлению

     @event 'action'
     @param {Object} event Событие
     @param {View} event.view Представление
     @param {Boolean} event.mouse Флаг использования мышки
     @param {Boolean} event.bubbling Флаг всплывающего события
     @for View
     @final
     @since 1.0.0
     */
    ACTION: 'action',

    /**
     Событие получения фокуса представлением

     @event 'focus'
     @param {Object} event Событие
     @param {View} event.view Представление
     @param {Boolean} event.mouse Флаг передачи фокуса мышкой
     @for View
     @final
     @since 1.0.0
     */
    FOCUS: 'focus',

    /**
     Событие потери фокуса представлением

     @event 'blur'
     @param {Object} event Событие
     @param {View} event.view Представление
     @for View
     @final
     @since 1.0.0
     */
    BLUR: 'blur',

    /**
     Событие изменения состояния фокуса у представления

     @event 'state:focused'
     @param {Object} event Событие
     @param {View} event.view Представление
     @param {Boolean} event.value Флаг наличия фокуса
     @for View
     @final
     @since 1.0.0
     */
    FOCUSED: 'state:focused',

    /**
     Событие изменения наличия фокуса на дочерних представлениях

     @event 'state:atfocus'
     @param {Object} event Событие
     @param {View} event.view Представление
     @param {Boolean} event.value Флаг наличия фокуса
     @param {Boolean} event.mouse Флаг изменения фокуса мышкой
     @for View
     @final
     @since 1.0.0
     */
    ATFOCUS: 'state:atfocus',

    /**
     Событие разблокировки представления

     @event 'enabled'
     @param {Object} event Событие
     @param {View} event.view Представление
     @for View
     @final
     @since 1.0.0
     */
    ENABLE: 'enabled',

    /**
     Событие блокировки представления

     @event 'disabled'
     @param {Object} event Событие
     @param {View} event.view Представление
     @for View
     @final
     @since 1.0.0
     */
    DISABLE: 'disabled',

    /**
     Событие изменения доступности представления

     @event 'state:enabled'
     @param {Object} event Событие
     @param {View} event.view Представление
     @param {Boolean} event.value Флаг доступности
     @for View
     @final
     @since 1.0.0
     */
    ENABLED: 'state:enabled',

    /**
     Событие отображение представления

     @event 'show'
     @param {Object} event Событие
     @param {View} event.view Представление
     @for View
     @final
     @since 1.0.0
     */
    SHOW: 'show',

    /**
     Событие скрытия представления

     @event 'hide'
     @param {Object} event Событие
     @param {View} event.view Представление
     @for View
     @final
     @since 1.0.0
     */
    HIDE: 'hide',

    /**
     Событие изменения видимости представления

     @event 'state:visible'
     @param {Object} event Событие
     @param {View} event.view Представление
     @param {Boolean} event.value Флаг видимости
     @for View
     @final
     @since 1.0.0
     */
    VISIBLE: 'state:visible',

    /**
     Событие перерисовки представления

     @event 'onredraw'
     @param {Object} event Событие
     @param {Object} [event.states={}] Хэш изменившихся состояний представления
     @param {Object} [event.data={}] Хэш изменившихся данных модели
     @for View
     @final
     @since 1.0.2
     */
    RENDER: 'onredraw',

    /**
     Событие изменения атрибутов модели или замены модели на новую

     @event 'model:change'
     @param {Object} event Событие
     @param {Backbone.Model} event.model Модель представления
     @param {View} event.view Представление
     @for View
     @final
     @since 1.0.16
     */
    MODEL_CHANGE: 'model:change'
};
