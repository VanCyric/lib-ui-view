var _diff = require('lodash/difference'),
    _extend = require('lodash/assign'),
    Backbone = require('backbone'),
    KeyEvents = require('../events/Key'),
    VMEvents = require('../events/ViewManager'),
    VMHelpers = require('../helpers/ViewManager');

/**
 Менеджер представлений

 @class ViewManager
 @constructor
 @param {Object} keyMap Список клавиш
 @param {String} [keyEvent='keydown'] Событие нажатия клавиши
 @param {Object} [target=window] Объект, на котором будут слушаться нажатия клавиш
 @uses Backbone.Events
 @since 1.0.0
 */
function ViewManager(keyMap, keyEvent, target) {
    var self = this;
    
    if (keyEvent == null){
        keyEvent = 'keydown';
    }
    
    if (target == null) {
        target = window;
    }
    
    this.unlockKeys();
    
    function onKeypress(event) {
        var keyCode, keyId;
        if (event.shiftKey) {
            keyCode = 1e8 + event.keyCode;
        } else {
            keyCode = event.keyCode;
        }
        keyId = keyMap[keyCode];
        if (keyId == null) {
            return;
        }
        event.preventDefault();
        self._handleKeypress(keyId, event);
    }
    
    target.addEventListener(keyEvent, onKeypress);
}

/**
 Текущее представление, для которого будут слаться события

 @property _focusTarget
 @type View
 @default null
 @private
 @since 1.0.0
 */
ViewManager.prototype._focusTarget = null;

/**
 Флаг блокировки клавиш

 @property _keyLock
 @type Boolean
 @default null
 @private
 @since 1.1.2
 */
ViewManager.prototype._keyLock = null;

/**
 Блокирует клавиши

 @method lockKeys
 @param {Boolean} [lock=true] Состояние блокировки
 @since 1.1.2
 */
ViewManager.prototype.lockKeys = function(lock) {
    this._keyLock = lock != null ? lock : true;
};

/**
 Разблокирует клавиши

 @method unlockKeys
 @since 1.1.2
 */
ViewManager.prototype.unlockKeys = function() {
    this.lockKeys(false);
};

/**
 Проверяет состояние блокировки клавиш

 @method keysAreLocked
 @return {Boolean} Результат проверки
 @since 1.1.2
 */
ViewManager.prototype.keysAreLocked = function() {
    var locked = this._keyLock;
    return locked != null ? locked : false;
};

/**
 Обрабатывает нажатие клавиши, рассылает соответствующие события

 @method _handleKeypress
 @param {String} keyId Название клавиши
 @param {Object} event Параметры первоначального DOM события
 @since 1.0.0
 */
ViewManager.prototype._handleKeypress = function(keyId, event) {
    var customEvent, dispatchEvent, view, triggeredView;

    if (this.keysAreLocked()) {
        return;
    }

    view = this.getFocusTarget();

    customEvent = {
        keyId: keyId,
        target: view,
        originalEvent: event,
        bubbling: true
    };

    dispatchEvent = function() {
        if ((view != null) && customEvent.bubbling) {
            triggeredView = view;

            if (view.hasParent()) {
                view = view.getParent();
            } else {
                view = null;
            }

            triggeredView.trigger(KeyEvents['KEY_CB'], customEvent, dispatchEvent);
        }
    };

    dispatchEvent();

    if (customEvent.bubbling) {
        this.trigger(KeyEvents['KEY_PRESS_VM'], customEvent);
    }
};

/**
 Проверяет наличие текущего представления

 @method hasFocusTarget
 @return {Boolean} Результат проверки
 @since 1.0.0
 */
ViewManager.prototype.hasFocusTarget = function() {
    return this._focusTarget != null;
};

/**
 Получает текущее представление

 @method getFocusTarget
 @return {View} Текущее представление
 @since 1.0.0
 */
ViewManager.prototype.getFocusTarget = function() {
    return this._focusTarget;
};

/**
 Представление, ограничивающее передвижение фокуса собой

 @property focusLocker
 @type View
 @private
 @since 1.1.0
 */
ViewManager.prototype._focusLocker = null;

/**
 Получает ограничитель фокуса

 @method getFocusLocker
 @return {View}
 @since 1.1.0
 */
ViewManager.prototype.getFocusLocker = function() {
    return this._focusLocker;
};

/**
 Устанавливает ограничитель фокуса

 @method setFocusLocker
 @param {View} focusLocker Представление, ограничивающее передвижение фокуса собой
 @since 1.1.0
 */
ViewManager.prototype.setFocusLocker = function(focusLocker) {
    this._focusLocker = focusLocker;
};

/**
 Снимает ограничитель фокуса

 @method unsetFocusLocker
 @since 1.1.0
 */
ViewManager.prototype.unsetFocusLocker = function() {
    this.setFocusLocker(null);
};

/**
 Устанавливает текущее представление и убирает фокус со старого, если имеется

 @method setFocusTarget
 @param {View} view Новое представление
 @param {Boolean} mouse Флаг передачи фокуса мышкой
 @since 1.0.0
 */
ViewManager.prototype.setFocusTarget = function(view, mouse) {
    var blurDiff, focusDiff, locker, newTree, oldTree, oldView, tree;

    if (view === this._focusTarget) {
        return;
    }

    if (mouse && this.keysAreLocked()) {
        return;
    }

    locker = this.getFocusLocker();

    if (locker != null) {
        if (view != null) {
            tree = view.getFamilyTree();
            if (tree.indexOf(locker) == -1) {
                return;
            }
        } else {
            return;
        }
    }

    if ((view == null) || view.isEnabled()) {
        oldTree = null;
        newTree = null;
        oldView = this._focusTarget;

        this._focusTarget = null;

        if (oldView != null) {
            oldView.blur();
            oldTree = oldView.getFamilyTree();
        }

        this._focusTarget = view;
        
        if (view != null) {
            newTree = view.getFamilyTree();
        }
        
        if ((newTree != null) && (oldTree != null)) {
            blurDiff = _diff(oldTree, newTree);
            focusDiff = _diff(newTree, oldTree);
        } else if (newTree != null) {
            blurDiff = [];
            focusDiff = newTree;
        } else if (oldTree != null) {
            blurDiff = oldTree;
            focusDiff = [];
        } else {
            blurDiff = [];
            focusDiff = [];
        }
        
        blurDiff.forEach(function(entity) {
            entity.setAtFocus(false, mouse);
        });
        
        focusDiff.forEach(function(entity) {
            entity.setAtFocus(true, mouse);
        });
        
        this.trigger(VMEvents['VM_FOCUS_CHANGE'], {
            next: view,
            prev: oldView
        });
        
        if (view != null) {
            view.focus(mouse);
        }
    }
};

/**
 Устанавливает связь представления с другим

 @method _setNeighbour
 @param {String} dir Направление, в котором находится другое представление
 @param {View} view Представление, которое надо привязать
 @private
 @since 1.0.0
 */
ViewManager.prototype._setNeighbour = function(dir, view) {
    var name = VMHelpers.nav;
    
    if (this[name] == null) {
        this[name] = {};
    }
    
    this[name][dir] = view;
};

/**
 Получает связанное представление

 @method _getNeighbour
 @param {String} dir Направление, в котором находится другое представление
 @return {View} Связанное представление
 @private
 @since 1.0.0
 */
ViewManager.prototype._getNeighbour = function(dir) {
    var neighbour = null,
        name = VMHelpers.nav;
    
    if (this[name] != null) {
        neighbour = this[name][dir];
    }
    
    return neighbour;
};

/**
 Получает связанные представления по всем направлениям

 @method _getNeighbours
 @return {Object} Пары направление / представление
 @private
 @since 1.0.0
 */
ViewManager.prototype._getNeighbours = function() {
    var neighbours = this[VMHelpers.nav];
    return neighbours != null ? neighbours : {};
};

/**
 Связывает представления сверху вниз

 @method topToBottom
 @param {Array} views Набор представлений
 @param {Boolean} [looped=false] Флаг замкнутости набора
 @since 1.0.0
 */
ViewManager.prototype.topToBottom = function(views, looped) {
    var start,
        stop,
        i,
        self = this;
    
    if (looped == null) {
        looped = false;
    }
    
    function link(i) {
        var first, second;
        
        first = views[i];
        second = views[i + 1];
        
        self._setNeighbour.call(first, 'down', second);
        self._setNeighbour.call(second, 'up', first);
    }
    
    for (i = 0; i < views.length - 1; i++) {
        link(i);
    }
    
    if (looped) {
        start = views[0];
        stop = views[views.length - 1];
        
        this._setNeighbour.call(start, 'up', stop);
        this._setNeighbour.call(stop, 'down', start);
    }
};

/**
 Связывает представления сверху вниз c замыканием концов

 @method topToBottomLoop
 @param {Array} views Набор представлений
 @deprecated Use 'this.topToBottom(views, true);'
 @since 1.0.0
 */
ViewManager.prototype.topToBottomLoop = function(views) {
    return this.topToBottom(views, true);
};

/**
 Связывает представления слева направо

 @method leftToRight
 @param {Array} views Набор представлений
 @param {Boolean} [looped=false] Флаг замкнутости набора
 @since 1.0.0
 */

ViewManager.prototype.leftToRight = function(views, looped) {
    var start,
        stop,
        i,
        self = this;
    
    if (looped == null) {
        looped = false;
    }
    
    function link(i) {
        var first, second;
        
        first = views[i];
        second = views[i + 1];
        
        self._setNeighbour.call(first, 'right', second);
        self._setNeighbour.call(second, 'left', first);
    }
    
    for (i = 0; i < views.length - 1; i++) {
        link(i);
    }
    
    if (looped) {
        start = views[0];
        stop = views[views.length - 1];
        
        this._setNeighbour.call(start, 'left', stop);
        this._setNeighbour.call(stop, 'right', start);
    }
};

/**
 Связывает представления слева направо c замыканием концов

 @method leftToRightLoop
 @param {Array} views Набор представлений
 @deprecated Use 'this.leftToRight(views, true);'
 @since 1.0.0
 */
ViewManager.prototype.leftToRightLoop = function(views) {
    return this.topToBotom(views, true);
};

/**
 Связывает представления сеткой

 @method grid
 @param {Array} views Набор представлений
 @param {Number} colsNum Количество столбцов в сетке
 @since 1.0.0
 */
ViewManager.prototype.grid = function(views, colsNum) {
    var cols = [],
        rows = [],
        view,
        i;

    function assignView(view, index) {
        var col = index % colsNum,
            row = Math.floor(index / colsNum);
        
        
        if (cols[col] == null) {
            cols[col] = [];
        }
        
        cols[col].push(view);
        
        if (rows[row] == null) {
            rows[row] = [];
        }
        
        rows[row].push(view);
    }
    
    for (i = 0; i < views.length; i++) {
        view = views[i];
        assignView(view, i);
    }

    for (i = 0; i < cols.length; i++) {
        this.topToBottom(cols[i]);
    }
    
    for (i = 0; i < rows.length; i++) {
        this.leftToRight(rows[i]);
    }
};

/**
 Ищет доступное представление по заданному направлению

 @method _findNext
 @param {View} view Представление, относительно которого производится поиск
 @param {String} dir Направление поиска
 @return {View} Результат поиска
 @private
 @since 1.0.0
 */
ViewManager.prototype._findNext = function(view, dir) {
    var next = this._getNeighbour.call(view, dir);
    
    if (next != null) {
        if (next.isVisible() && next.isEnabled()) {
            return next;
        } else {
            return this._findNext(next, dir);
        }
    } else {
        return null;
    }
};

/**
 Перемещает фокус по заданному направлению

 @method moveFocus
 @param {View} view Представление, относительно которого смещается фокус
 @param {String} dir Направление смещения фокуса
 @param {View} [origin=null] Первоначальное представление, инициализировавшее передачу фокуса
 @return {View|null} Представление, которому будет передан фокус
 @since 1.0.0
 */
ViewManager.prototype.moveFocus = function(view, dir, origin) {
    var next = this._findNext(view, dir),
        result = null,
        targetView;
    
    if (origin == null) {
        origin = null;
    }

    if ((next != null) && next !== view) {
        this.setFocusTarget(next);
        result = next;
    } else if (view.hasParent()) {
        result = this.moveFocus(view.getParent(), dir, view);
    }
    
    if ((origin == null) && (result == null)) {
        this.trigger(VMEvents['VM_FOCUS_END'], {
            view: view,
            dir: dir
        });
        targetView = view;
        
        while (targetView != null) {
            targetView.trigger(VMEvents['VM_FOCUS_END'], {
                view: view,
                dir: dir
            });
            targetView = targetView.getParent();
        }
    }
    
    return result;
};

/**
 Удаляет связи представление, а также само представление из связей

 @method deleteView
 @param {View} view Представление для удаления
 @since 1.0.0
 */
ViewManager.prototype.deleteView = function(view) {
    var dirs = VMHelpers.dirs,
        dir,
        i,
        self = this;
    
    if (view === this._focusTarget) {
        this._focusTarget = null;
        view.blur();
    }

    function removeLinks(dir, i){
        var i2 = (i + 2) % dirs.length,
            dir2 = dirs[i2],
            first = self._getNeighbour.call(view, dir),
            second = self._getNeighbour.call(view, dir2);

        if (first != null) {
            self._setNeighbour.call(view, dir, null);
            self._setNeighbour.call(first, dir2, second);
        }

        if (second != null) {
            self._setNeighbour.call(view, dir2, null);
            self._setNeighbour.call(second, dir, first);
        }
    }

    for (i = 0; i < dirs.length; i++) {
        dir = dirs[i];
        removeLinks(dir, i);
    }
};

_extend(ViewManager.prototype, Backbone.Events);

module.exports = ViewManager;
