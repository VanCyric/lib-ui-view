module.exports = {
    /**
     Событие изменения текущего представления в фокусе

     @event 'focus:change'
     @param {Object} event Событие
     @param {View} [event.prev] Предыдущее представление
     @param {View} [event.next] Новое представление
     @for ViewManager
     @final
     @since 1.0.0
     */
    VM_FOCUS_CHANGE: 'focus:change',

    /**
     Событие невозможности перевести фокус в заданном направлении

     @event 'focus:end'
     @param {Object} event Событие
     @param {View} event.view Представление, запросившее перевод фокуса
     @param {View} event.dir Направление перевода фокуса
     @for ViewManager
     @final
     @since 1.0.3
     */
    VM_FOCUS_END: 'focus:end'
};
