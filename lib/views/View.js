var _clone = require('lodash/clone'),
    _extend = require('lodash/assign'),
    _keys = require('lodash/keys'),
    _mapValues = require('lodash/mapValues'),
    Backbone = require('backbone'),
    ViewEvents = require('../events/View'),
    KeyHandlers = require('../handlers/KeyHandlers'),
    StatesModel = require('../models/StatesModel'),
    requestAnimationFrame,
    View;

requestAnimationFrame = window.requestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function(callback) {
    return setTimeout(callback, 1);
};

Backbone.$ = require('jquery');

/**
 Базовое представление

 @class View
 @constructor
 @param {Object} options Параметры представления
 @param {String} [options.name] Имя представления
 @param {View} [options.parent] Родительское представление
 @param {ViewManager} [options.viewManager] Менеджер представлений, не нужен для дочерних представлений
 @param {Backbone.Model} [options.model] Модель данных
 @param {Boolean} [options.visible=true] Первоначальное состояние видимости представления
 @param {Boolean} [options.enabled=true] Первоначальное состояние доступности представления
 @param {String} [options.navKeys] Клавиши направлений
 @param {Boolean} [options.mouseEvents=true] Флаг использования мыши
 @param {Boolean} [options.rememberLastFocused=true] Флаг запоминания передачи фокуса родителем
 @param {Boolean} [options.autoRefocused=true] Флаг восстановления фокуса на дочернем представлении
 @extends Backbone.View
 @since 1.0.0
 */
View = Backbone.View.extend({
    /**
     Флаг инициализации

     @property _initialized
     @type Boolean
     @default false
     @private
     @since 1.0.0
     */
    _initialized: false,

    /**
     Id представления

     @property _id
     @type Number
     @default null
     @writeOnce
     @private
     @since 1.0.0
     */
    _id: null,

    /**
     Имя класса

     @property _className
     @type String
     @default 'View'
     @readOnly
     @private
     @since 1.0.0
     */
    _className: 'View',

    /**
     Родительское представление

     @property _parent
     @type View
     @default null
     @private
     @since 1.0.0
     */
    _parent: null,

    /**
     Модель состояний представления

     @property _states
     @type StatesModel
     @default null
     @writeOnce
     @private
     @since 1.0.0
     */
    _states: null,

    /**
     Сss класс для скрытого представления

     @property _hiddenClass
     @type String
     @default 'hidden'
     @readOnly
     @private
     @since 1.0.0
     */
    _hiddenClass: 'hidden',

    /**
     Css класс для заблокированного представления

     @property _disabledClass
     @type String
     @default null
     @readOnly
     @private
     @since 1.0.0
     */
    _disabledClass: null,

    /**
     Хэш измененных состояний представления

     @property _changedStatesAttributes
     @type Object
     @default null
     @private
     @since 1.0.0
     */
    _changedStatesAttributes: null,

    /**
     Хэш измененных данных модели, прикрепленной к представлению

     @property _changedModelAttributes
     @type Object
     @default null
     @private
     @since 1.0.0
     */
    _changedModelAttributes: null,

    /**
     Флаг отсутствия модель данных

     @property _modelIsEmpty
     @type Boolean
     @default true
     @private
     @since 1.0.0
     */
    _modelIsEmpty: true,

    /**
     Флаг ожидания перерисовки

     @property _waitingFrame
     @type Boolean
     @default false
     @private
     @since 1.0.7
     */
    _waitingFrame: false,

    /**
     Массив дочерних представлений

     @property _views
     @type Array
     @default null
     @private
     @since 1.0.0
     */
    _views: null,

    /**
     Дочернее представление, на которое был передан фокус

     @property _lastFocused
     @type View
     @default null
     @private
     @since 1.0.0
     */
    _lastFocused: null,

    /**
     Флаг передачи родителю информации, что представление получило фокус

     @property _rememberLastFocused
     @type Boolean
     @default null
     @writeOnce
     @private
     @since 1.0.14
     */
    _rememberLastFocused: null,

    /**
     Флаг восстановления фокуса на дочернем представлении

     @property _autoRefocused
     @type Boolean
     @default null
     @writeOnce
     @private
     @since 1.0.17
     */
    _autoRefocused: null,

    /**
     Менеджер представлений

     @property _viewManager
     @type ViewManager
     @default null
     @writeOnce
     @private
     @since 1.0.0
     */
    _viewManager: null,

    /**
     Флаг поддержки мыши

     @property _mouseEvents
     @type Boolean
     @default null
     @writeOnce
     @private
     @since 1.0.9
     */
    _mouseEvents: null,

    /**
     Менеджер нажатий клавиш

     @property keyHandlers
     @type KeyHandlers
     @default null
     @writeOnce
     @since 1.0.0
     */
    keyHandlers: null,

    /**
     Имя представления

     @property name
     @type String
     @default null
     @writeOnce
     @since 1.0.0
     */
    name: null,

    /**
     DOM события, которые обрабатываются представлением

     @property events
     @type Object
     @default {'click': '_handlerAction', 'mouseenter': 'focus'}
     @readOnly
     @since 1.0.0
     */
    events: {
        'click': '_handleAction',
        'mouseenter': '_handleMouseFocus'
    },

    /**
     Инициализирует представление

     @method initialize
     @param {Object} options Параметры представления
     @param {String} [options.name] Имя представления
     @param {View} [options.parent] Родительское представление
     @param {ViewManager} [options.viewManager] Менеджер представлений, не нужен для дочерних представлений
     @param {Backbone.Model} [options.model] Модель данных
     @param {Boolean} [options.visible=true] Первоначальное состояние видимости представления
     @param {Boolean} [options.enabled=true] Первоначальное состояние доступности представления
     @param {String} [options.navKeys] Клавиши направлений
     @param {Boolean} [options.mouseEvents=true] Флаг использования мыши
     @param {Boolean} [options.rememberLastFocused=true] Флаг запоминания передачи фокуса родителем
     @param {Boolean} [options.autoRefocused=true] Флаг восстановления фокуса на дочернем представлении
     @since 1.0.0
     */
    initialize: function(options) {
        if (options == null) {
            options = {};
        }
        this._initId();
        this._initName(options.name);
        this._initViews();
        this._initHashes();
        this._initStatesModel(options);
        this._initKeyHandlers(options.navKeys);
        this._initMouseEvents(options.mouseEvents);
        this.setParent(options.parent);
        this._initViewManager(options.viewManager);
        this.setModel(options.model, true);
        this._setRememberingLastFocused(options.rememberLastFocused);
        this._setAutoRefocused(options.autoRefocused);
        this._initialized = true;
        this.invalidate();
    },

    /**
     Инициализирует идентификатор представления

     @method _initId
     @private
     @since 1.0.0
     */
    _initId: function() {
        this._id = this.constructor.uid;
        this.constructor.uid++;
    },

    /**
     Инициализирует имя представления

     @method _initName
     @param {String} [name] Имя представления
     @private
     @since 1.0.0
     */
    _initName: function(name) {
        if (name != null) {
            this.name = name.replace(/@@/, this.getId());
        } else {
            this.name = '' + this._className + '-' + (this.getId());
        }
    },


    /**
     Инициализирует менеджер представлений

     @method _initViewManager
     @param {ViewManager} viewManager Менеджер представлений
     @private
     @since 1.0.0
     */
    _initViewManager: function(viewManager) {
        if (viewManager != null) {
            this._viewManager = viewManager;
        } else if (this.hasParent()) {
            this._viewManager = this.getParent().getViewManager();
        } else {
            this._viewManager = null;
        }
    },

    /**
     Инициализирует хранилище дочерних представлений

     @method _initViews
     @private
     @since 1.0.0
     */
    _initViews: function() {
        if (this._views == null) this._views = [];
    },

    /**
     Инициализирует хэши измененных атрибутов

     @method _initHashes
     @private
     @since 1.0.0
     */
    _initHashes: function() {
        this._changedModelAttributes = {};
        this._changedStatesAttributes = {};
    },

    /**
     Инициализирует модель состояний представления

     @method _initStatesModel
     @private
     @since 1.0.0
     */
    _initStatesModel: function(options) {
        var StatesModelClass = this.constructor.statesModel,
            visible = options.visible,
            enabled = options.enabled;

        this._states = new StatesModelClass;
        this._states.on('change:visible', this._toggleVisibility, this);
        this._states.set('visible', visible != null ? visible : true);
        this._states.set('enabled', enabled != null ? enabled : true);
        return this._states.on('change', this._invalidateStates, this);
    },

    /**
     Инициализирует менеджер событий нажатия клавиш

     @method _initKeyHandlers
     @param {String} [navKeys] навигационные клавиши
     @private
     @since 1.0.0
     */
    _initKeyHandlers: function(navKeys) {
        this.keyHandlers = new KeyHandlers(this);
        this.keyHandlers.add('enter', function(event) {
            event.bubbling = false;
            this._handleAction();
        });
        if (navKeys != null) {
            this.keyHandlers.add(navKeys, function(event) {
                event.bubbling = false;
                if (this.hasViewManager()) {
                    return this.getViewManager().moveFocus(this, event.keyId);
                }
            });
        }
    },

    /**
     Инициализирует поддержку мыши

     @method _initMouseEvents
     @param {Boolean} [_mouseEvents=true] Флаг поддержки мыши
     @private
     @since 1.0.9
     */
    _initMouseEvents: function(_mouseEvents) {
        this._mouseEvents = _mouseEvents != null ? _mouseEvents : true;
    },

    /**
     Проверяет поддержку мыши

     @method isMouseSupported
     @return {Boolean} Результат проверки
     @since 1.0.9
     */

    isMouseSupported: function() {
        return this._mouseEvents;
    },

    /**
     Проверяет инициализировано ли представление

     @method isInitialized
     @return {Boolean} Результат проверки
     @since 1.0.0
     */
    isInitialized: function() {
        return this._initialized;
    },

    /**
     Получает идентификатор представления

     @method getId
     @return {Number} Идентификатор представления
     @since 1.0.0
     */
    getId: function() {
        return this._id;
    },

    /**
     Проверяет наличие родителя у представления

     @method hasParent
     @return {Boolean} Результат проверки
     @since 1.0.0
     */
    hasParent: function() {
        return this._parent != null;
    },

    /**
     Получает родителя представления

     @method getParent
     @return {View|null} Родитель
     @since 1.0.0
     */
    getParent: function() {
        var parent = this._parent;
        return parent != null ? parent : null;
    },

    /**
     Задает родителя представлению

     @method setParent
     @param {View} parent Родитель
     @since 1.0.0
     */
    setParent: function(parent) {
        if (this.hasParent()) {
            this._parent.deleteChild(this);
        }
        this._parent = parent;
        if (parent != null) {
            this._parent.addView(this);
        }
    },

    /**
     Проверяет наличие менеджера представлений

     @method hasViewManager
     @return {Boolean} Результат проверки
     @since 1.0.0
     */
    hasViewManager: function() {
        return this._viewManager != null;
    },

    /**
     Получает менеджер представлений

     @method getViewManager
     @return {ViewManager} Менеджер представлений
     @since 1.0.0
     */
    getViewManager: function() {
        var vm = this._viewManager;
        return vm != null ? vm : null;
    },

    /**
     Получает массив родителей

     @method getFamilyTree
     @return {Array} Массив представлений
     @since 1.0.0
     */
    getFamilyTree: function() {
        var tree, view;
        tree = [this];
        if (this.hasParent()) {
            view = this.getParent();
            while (view != null) {
                tree.unshift(view);
                view = view.getParent();
            }
        }
        return tree;
    },

    /**
     Преобразует представление в строку

     @method toString
     @return {String} Результат преобразования
     @since 1.0.0
     */
    toString: function() {
        var views = this.getFamilyTree(),
            names = views.map(function(view) {
                return view.name;
            });

        return names.join('/');
    },

    /**
     Получает массив дочерних представлений

     @method getViews
     @return {Array} Массив дочерних представлений
     @since 1.0.0
     */
    getViews: function() {
        var views = this._views;
        return views != null ? views : [];
    },

    /**
     Ищет дочернее представление с заданным именем

     @method getView
     @param {String} name Имя дочернего представления
     @return {View|null} Результат поиска
     @since 1.0.0
     */
    getView: function(name) {
        var view;

        view = this.getViews().filter(function(view) {
            return view.name === name;
        })[0];

        return view || null;
    },

    /**
     Ищет дочернее представление по индексу

     @method getViewAt
     @param {Number} index Индекс дочернего представления
     @return {View|null} Результат поиска
     @since 1.0.0
     */
    getViewAt: function(index) {
        return this.getViews()[index] || null;
    },

    /**
     Добавляет представление в массив дочерних представлений

     @method addView
     @param {View} view Представление, которое нужно добавить
     @since 1.0.0
     */
    addView: function(view) {
        var views;
        
        views = this.getViews();
        if (views.indexOf(view) === -1) {
            views.push(view);
        }
    },

    /**
     Убирает ссылку на дочернее представление

     @method deleteChild
     @param {View} view Дочернее представление
     @since 1.0.0
     */
    deleteChild: function(view) {
        var index, views;
        
        if (this.getLastFocused() === view) {
            this.setLastFocused(null);
        }
        
        views = this.getViews();
        index = views.indexOf(view);
        
        if (index !== -1) {
            views.splice(index, 1);
        }
    },

    /**
     Устанавливает флаг запоминания передачи фокуса родителем для этого представления

     @method _setRememberingLastFocused
     @param {Boolean} [_rememberLastFocused=true] Флаг запоминания передачи фокуса родителем для этого представления
     @private
     @since 1.0.14
     */
    _setRememberingLastFocused: function(_rememberLastFocused) {
        this._rememberLastFocused = _rememberLastFocused != null ? _rememberLastFocused : true;
    },

    /**
     Проверяет должен ли родитель запоминать передачу фокуса для этого представления

     @method remembersLastFocused
     @return {Boolean} Результат проверки
     @since 1.0.14
     */
    remembersLastFocused: function() {
        return this._rememberLastFocused;
    },

    /**
     Устанавливает флаг восстановления фокуса на дочернем представлении

     @method _setAutoRefocused
     @param {Boolean} [_autoRefocused=true] Флаг восстановления фокуса на дочернем представлении
     @private
     @since 1.0.17
     */
    _setAutoRefocused: function(_autoRefocused) {
        this._autoRefocused = _autoRefocused != null ? _autoRefocused : true;
    },

    /**
     Проверяет, восстанавливать ли фокус на дочернем представлении

     @method isAutoRefocused
     @return {Boolean} Результат проверки
     @since 1.0.17
     */
    isAutoRefocused: function() {
        return this._autoRefocused;
    },

    /**
     Проверяет наличие дочернего представления с фокусом

     @method hasLastFocused
     @return {Boolean} Результат проверки
     @since 1.0.0
     */
    hasLastFocused: function() {
        return this._lastFocused != null;
    },

    /**
     Получает дочернее представление с фокусом

     @method getLastFocused
     @return {View} Представление
     @since 1.0.0
     */
    getLastFocused: function() {
        return this._lastFocused;
    },

    /**
     Сохраняет дочернее представление с фокусом и прокидывает себя наверх

     @method setLastFocused
     @param {View} view Дочернее представление
     @param {Boolean} [toParent=true] Флаг передачи действия дальше по цепочке (родителю)
     @since 1.0.0
     */
    setLastFocused: function(view, toParent) {
        if (toParent == null) {
            toParent = true;
        }
        
        this._lastFocused = view;
        
        if (this.hasParent() && toParent && this.remembersLastFocused()) {
            this.getParent().setLastFocused(this);
        }
    },

    /**
     Выполняет уничтожение представления, а именно:
     - убирает ссылку на менеджер представлений и связи с другими представлениями
     - убирает ссылку на менеджер событий нажатия клавиш
     - уничтожает детей
     - убирает ссылку на коллекцию и отписывается от ее событий
     - убирает ссылку на модель и отписывается от ее событий
     - очищает вспомогательную модель
     - удаляет ссылку на вспомогательную модель
     - отправляет родителю запрос на удаление ссылки на себя
     - удаляет ссылку на родителя
     - вызывает удаление Backbone.View

     @method destroy
     @since 1.0.0
     */
    destroy: function() {
        var viewManager = this.getViewManager(),
            views = this.getViews().slice(0),
            i,
            view;
        
        if (viewManager != null) {
            this._initViewManager(null);
            viewManager.deleteView(this);
        }
        
        this.keyHandlers.destroy();
        this.keyHandlers = null;

        function destroy(view){
            view.destroy();
        }

        for (i = 0, views.length; i < views.length; i++) {
            view = views[i];
            destroy(view);
        }

        this._views = null;

        if (this.collection != null) {
            this.collection.off(null, null, this);
            this.collection = null;
        }

        if (this.model != null) {
            this.model.off(null, null, this);
            this.model = null;
        }

        this._states.clear();
        this._states.off();
        this._states = null;

        if (this.hasParent()) {
            this.setParent(null);
        }

        this.remove();
    },

    /**
     Обрабатывает наведение мыши

     @method _handleMouseFocus
     @private
     @since 1.0.9
     */
    _handleMouseFocus: function() {
        if (this.isAtFocus() || !this.isMouseSupported()) {
            return;
        }

        if (this.hasViewManager() && this.getViewManager().keysAreLocked()) {
            return;
        }

        this.focus(true);
    },

    /**
     Обрабатывает действие представления

     @method _handlerAction
     @param {Object} [event] Событие мыши
     @private
     @since 1.0.0
     */
    _handleAction: function() {
        var customEvent, origin, type, view, originalEvent;

        if (!this.isMouseSupported()) return;
        if (this.hasViewManager() && this.getViewManager().keysAreLocked()) return;

        view = this;

        if (typeof event !== 'undefined' && event !== null) {
            type = event.type || 'kbd';

            originalEvent = event.originalEvent;
            if (originalEvent && originalEvent.toString) {
                origin = event.originalEvent.toString();
            } else {
                origin = 'element';
            }
        }

        customEvent = {
            view: view,
            bubbling: true,
            mouse: type === 'click' || origin === '[object MouseEvent]'
        };

        while ((view != null) && customEvent.bubbling) {
            view.trigger(ViewEvents['ACTION'], customEvent);
            view = view.getParent();
        }
    },

    /**
     Перерисовывает представление

     @method render
     @chainable
     @since 1.0.0
     */
    render: function() {
        if (this._changedStatesAttributes['enabled'] != null) {
            this._toggleEnabled(this._changedStatesAttributes['enabled']);
        }

        if (this._changedStatesAttributes['atfocus'] != null) {
            this._toggleFocused(this._changedStatesAttributes['atfocus']);
        }

        this.trigger(ViewEvents['RENDER'], {
            states: _clone(this._changedStatesAttributes),
            data: _clone(this._changedModelAttributes)
        });

        return this;
    },

    /**
     Указывает браузеру, что необходимо запланировать перерисовку на следующем кадре анимации;
     Если перерисовка уже выполняется, новый запрос не составляется;
     После перерисовки хэши измененных атрибутов сбрасываются

     @method _requestRender
     @private
     @since 1.0.0
     */
    _requestRender: function() {
        var redraw;

        if (this._waitingFrame) return;

        this._waitingFrame = true;

        redraw = (function(_this){
            return function() {
                _this.render()._initHashes();
                _this._waitingFrame = false;
            };
        })(this);

        requestAnimationFrame(redraw);
    },

    /**
     Инвалидирует модель состояний;
     Метод вызывается при изменении атрибутов модели состояний;
     Если представление видимо, вызывается перерисовка,
     иначе ожидается изменение состояния видимости

     @method _invalidateStates
     @private
     @since 1.0.0
     */
    _invalidateStates: function() {
        var length;

        if (!this.isInitialized()) return;

        _extend(this._changedStatesAttributes, this._states.changedAttributes());

        if (this._changedStatesAttributes['visible'] != null) {
            length = 1;
        } else {
            length = 0;
        }

        delete this._changedStatesAttributes['visible'];

        if (_keys(this._changedStatesAttributes).length <= length) {
            return;
        }

        if (this.isVisible()) {
            return this._requestRender();
        } else {
            this.off(ViewEvents['SHOW'], this._requestRender, this);
            return this.on(ViewEvents['SHOW'], this._requestRender, this);
        }
    },

    /**
     Задает модель данных представления

     @method setModel
     @param {Backbone.Model|null} model Модель данных
     @param {Boolean} force Флаг принудительного задания модели
     @since 1.0.0
     */
    setModel: function(model, force) {
        if (force == null) {
            force = false;
        }

        if (model === this.model && !force) return;

        if (this.model != null) {
            this.model.off(null, null, this);
            this._changedModelAttributes = this.model.attributes != null ? _mapValues(this.model.attributes, function() {
                return null;
            }) : {};
        }

        this.model = model;

        if (this.model != null) {
            this.model.on('change', function() {
                return this._invalidateModel(false);
            }, this);
        }

        this._modelIsEmpty = this.model == null;
        this._invalidateModel(true);
    },

    /**
     Проверяет, привязани ли модель с данными

     @method hasData
     @return {Boolean} Результат проверки
     @since 1.0.5
     */
    hasData: function() {
        return !this._modelIsEmpty;
    },

    /**
     Инвалидирует модель данных;
     Метод вызывается при изменении атрибутов модели данных,
     либо при задании новой модели данных;
     Если представление видимо, вызывается перерисовка,
     иначе ожидается изменение состояния видимости

     @method _invalidateModel
     @param {Boolean} [init=false] Флаг, указывающий, что модель только что была задана и нужно обновить все атрибуты
     @private
     @since 1.0.0
     */
    _invalidateModel: function(init) {
        var attrs;

        if (init == null) {
            init = false;
        }

        if (!this.isInitialized()) return;

        attrs = this.model.attributes;

        if (!this._modelIsEmpty) {
            if (init) {
                _extend(this._changedModelAttributes, _clone(attrs || {}));
            } else {
                _extend(this._changedModelAttributes, this.model.changedAttributes());
            }
        }

        this.trigger(ViewEvents['MODEL_CHANGE'], {
            model: this.model,
            view: this
        });

        if (this.isVisible()) {
            this._requestRender();
        } else {
            this.off(ViewEvents['SHOW'], this._requestRender, this);
            this.on(ViewEvents['SHOW'], this._requestRender, this);
        }
    },

    /**
     Выполняет полную инвалидацию по запросу пользователя;
     Используется, когда данные моделей не изменились, но требуется перерисовка;
     Если представление видимо, вызывается перерисовка,
     иначе ожидается изменение состояния видимости

     @method invalidate
     @since 1.0.0
     */
    invalidate: function() {
        if (!this.isInitialized()) return;

        this._changedStatesAttributes = _clone(this._states.attributes);
        delete this._changedStatesAttributes['visible'];

        if (this._modelIsEmpty) {
            this._changedModelAttributes = {};
        } else {
            this._changedModelAttributes = _clone(this.model.attributes);
        }

        if (this.isVisible()) {
            this._requestRender();
        } else {
            this.off(ViewEvents['SHOW'], this._requestRender, this);
            this.on(ViewEvents['SHOW'], this._requestRender, this);
        }
    },

    /**
     Проверяет, является ли представление видимым

     @method isVisible
     @return {Boolean} Результат проверки
     @since 1.0.0
     */
    isVisible: function() {
        return this._states.get('visible');
    },

    /**
     Изменяет состояние видимости представления

     @method setVisible
     @param {Boolean} [visible] Новое значение видимости
     @since 1.0.0
     */
    setVisible: function(visible) {
        var event;

        if (visible == null) {
            visible = !this._states.get('visible');
        }

        this._states.set('visible', visible);
        this.trigger(ViewEvents['VISIBLE'], {
            view: this,
            value: visible
        });

        if (visible) {
            event = ViewEvents['SHOW'];
        } else {
            event = ViewEvents['HIDE'];
        }

        this.trigger(event, {
            view: this
        });
    },

    /**
     Изменяет видимость HTML элемента представления, основываясь на состоянии видимости

     @method _toggleVisibility
     @param {Backbone.Model} model Модель состояний представления
     @param {Boolean} visible Значение состояния видимости
     @private
     @since 1.0.0
     */
    _toggleVisibility: function(model, visible) {
        if ((this._hiddenClass != null) && (this.$el != null)) {
            this.$el.toggleClass(this._hiddenClass, !visible);
        }
    },

    /**
     Проверяет, является ли представление доступным

     @method isEnabled
     @return {Boolean} Результат проверки
     @since 1.0.0
     */
    isEnabled: function() {
        return this._states.get('enabled');
    },

    /**
     Изменяет состояние доступности представления

     @method setEnabled
     @param {Boolean} [enabled] Новое значение доступности
     @since 1.0.0
     */
    setEnabled: function(enabled) {
        var event;

        if (enabled == null) {
            enabled = !this._states.get('enabled');
        }

        this._states.set('enabled', enabled);
        this.trigger(ViewEvents['ENABLED'], {
            view: this,
            value: enabled
        });

        if (enabled) {
            event = ViewEvents['ENABLED'];
        } else {
            event = ViewEvents['DISABLE'];
        }

        this.trigger(event, {
            view: this
        });
    },

    /**
     Изменяет доступность представления, основываясь на состоянии доступности

     @method _toggleEnabled
     @param {Boolean} enabled Значение состояния доступности
     @private
     @since 1.0.0
     */
    _toggleEnabled: function(enabled) {
        if ((this._disabledClass != null) && (this.$el != null)) {
            this.$el.toggleClass(this._disabledClass, !enabled);
        }
    },

    /**
     Передает фокус на представление

     @method focus
     @param {Boolean} [mouse=false] Флаг передачи фокуса мышкой
     @since 1.0.0
     */
    focus: function(mouse) {
        var viewManager;

        if (mouse == null) {
            mouse = false;
        }

        if (!this.isEnabled()) return;

        viewManager = this.getViewManager();

        if ((viewManager != null) && viewManager.getFocusTarget() !== this) {
            viewManager.setFocusTarget(this, mouse);
        } else {
            this._setFocused(true, mouse);
        }
    },

    /**
     Убирает фокус с представления

     @method blur
     @since 1.0.0
     */
    blur: function() {
        var viewManager = this.getViewManager();

        if ((viewManager != null) && viewManager.getFocusTarget() === this) {
            viewManager.setFocusTarget(null);
        } else {
            this._setFocused(false);
        }
    },

    /**
     Проверяет, находится ли представление в фокусе

     @method isFocused
     @return {Boolean} Результат проверки
     @since 1.0.0
     */
    isFocused: function() {
        return this._states.get('focused');
    },

    /**
     Проверяет, находится ли дочернее представление в фокусе

     @method isAtFocus
     @return {Boolean} Результат проверки
     */
    isAtFocus: function() {
        return this._states.get('atfocus');
    },

    /**
     Изменяет состояние наличия фокуса на представлении;
     Приватный метод. Для передачи фокуса следует использовать метод focus

     @method _setFocused
     @param {Boolean} focused Текущее состояние
     @param {Boolean} [mouse=false] Фокус был наведен мышкой
     @private
     @since 1.0.0
     */
    _setFocused: function(focused, mouse) {
        var event, params, view, views;

        if (mouse == null) {
            mouse = false;
        }

        function isAvailable(view){
            return view.isEnabled() && view.isVisible();
        }

        views = this.getViews().filter(isAvailable);

        if (focused && views.length > 0 && this.isAutoRefocused()) {
            view = this.getLastFocused();

            if ((view != null) && view.isEnabled() && view.isVisible()) {
                view.focus();
            } else {
                views[0].focus();
            }
        } else {
            this._states.set('focused', focused);
            this.trigger(ViewEvents['FOCUSED'], {
                view: this,
                value: focused
            });

            params = {
                view: this
            };

            if (focused) {
                if (this.hasParent() && this.remembersLastFocused()) {
                    this.getParent().setLastFocused(this);
                }
                event = ViewEvents['FOCUS'];
                params.mouse = mouse;
            } else {
                event = ViewEvents['BLUR'];
            }
            this.trigger(event, params);
        }
    },

    /**
     Изменяет состояние наличия фокуса на представлении или дочерних представлениях;
     Метод не должен использоваться. Он сделан публичным для обращения менеджера представлений

     @method setAtFocus
     @param {Boolean} atfocus Текущее состояние
     @param {Boolean} mouse Флаг изменения фокуса мышкой
     @since 1.0.0
     */
    setAtFocus: function(atfocus, mouse) {
        this._states.set('atfocus', atfocus);
        this.trigger(ViewEvents['ATFOCUS'], {
            view: this,
            value: atfocus,
            mouse: mouse
        });
    },

    /**
     Переключает класс 'focused'

     @method _toggleFocused
     @param {Boolean} focused Наличие фокуса
     @private
     @since 1.0.0
     */
    _toggleFocused: function(focused) {
        if (this.$el != null) {
            return this.$el.toggleClass('focused', focused);
        }
    }
}, {
    /**
     Счетчик представлений

     @property uid
     @type Number
     @default 0
     @readOnly
     @static
     @since 1.0.0
     */
    uid: 0,

    /**
     Конструктор модели состояний

     @property statesModel
     @type Function
     @default StatesModel
     @readOnly
     @static
     @since 1.0.6
     */
    statesModel: StatesModel
});

module.exports = View;
