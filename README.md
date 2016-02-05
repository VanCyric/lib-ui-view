lib-ui-view (1.2.3)
=====

*Backbone based view for SmartTV*

View
=====

Extends: Backbone.View

Since: 1.0.0

Базовое представление

constructor
-----

**View**(options)

Базовое представление

Since: 1.0.0

**Parameters:**

* **options** *{Object}* Параметры представления

    * **[name]** *{String}* Имя представления

    * **[parent]** *{View}* Родительское представление

    * **[viewManager]** *{ViewManager}* Менеджер представлений, не нужен для дочерних представлений

    * **[model]** *{Backbone.Model}* Модель данных

    * **[visible=true]** *{Boolean}* Первоначальное состояние видимости представления

    * **[enabled=true]** *{Boolean}* Первоначальное состояние доступности представления

    * **[navKeys]** *{String}* Клавиши направлений

    * **[mouseEvents=true]** *{Boolean}* Флаг использования мыши

    * **[rememberLastFocused=true]** *{Boolean}* Флаг запоминания передачи фокуса родителем

    * **[autoRefocused=true]** *{Boolean}* Флаг восстановления фокуса на дочернем представлении

- - -

Events:
-----

**'keypress:callback'**

Событие нажатия на клавишу с обратным вызовом

Since: 1.0.0

**Parameters:**

* **event** *{Object}* Событие

    * **keyId** *{String}* Нажатая клавиша

    * **target** *{View}* Представление, на котором произошло нажатие клавиши

    * **originalEvent** *{Object}* Первоначальное событие DOM

    * **bubbling** *{Boolean}* Флаг всплывающего события

* **callback** *{Function}* Функция обратного вызова

- - -

**'keypress'**

Событие нажатия на клавишу

Since: 1.0.0

**Parameters:**

* **event** *{Object}* Событие

    * **keyId** *{String}* Нажатая клавиша

    * **target** *{View}* Представление, на котором произошло нажатие клавиши

    * **originalEvent** *{Object}* Первоначальное событие DOM

    * **bubbling** *{Boolean}* Флаг всплывающего события

- - -

**'action'**

Событие нажатия клавиши enter или клика по представлению

Since: 1.0.0

**Parameters:**

* **event** *{Object}* Событие

    * **view** *{View}* Представление

    * **mouse** *{Boolean}* Флаг использования мышки

    * **bubbling** *{Boolean}* Флаг всплывающего события

- - -

**'focus'**

Событие получения фокуса представлением

Since: 1.0.0

**Parameters:**

* **event** *{Object}* Событие

    * **view** *{View}* Представление

    * **mouse** *{Boolean}* Флаг передачи фокуса мышкой

- - -

**'blur'**

Событие потери фокуса представлением

Since: 1.0.0

**Parameters:**

* **event** *{Object}* Событие

    * **view** *{View}* Представление

- - -

**'state:focused'**

Событие изменения состояния фокуса у представления

Since: 1.0.0

**Parameters:**

* **event** *{Object}* Событие

    * **view** *{View}* Представление

    * **value** *{Boolean}* Флаг наличия фокуса

- - -

**'state:atfocus'**

Событие изменения наличия фокуса на дочерних представлениях

Since: 1.0.0

**Parameters:**

* **event** *{Object}* Событие

    * **view** *{View}* Представление

    * **value** *{Boolean}* Флаг наличия фокуса

    * **mouse** *{Boolean}* Флаг изменения фокуса мышкой

- - -

**'enabled'**

Событие разблокировки представления

Since: 1.0.0

**Parameters:**

* **event** *{Object}* Событие

    * **view** *{View}* Представление

- - -

**'disabled'**

Событие блокировки представления

Since: 1.0.0

**Parameters:**

* **event** *{Object}* Событие

    * **view** *{View}* Представление

- - -

**'state:enabled'**

Событие изменения доступности представления

Since: 1.0.0

**Parameters:**

* **event** *{Object}* Событие

    * **view** *{View}* Представление

    * **value** *{Boolean}* Флаг доступности

- - -

**'show'**

Событие отображение представления

Since: 1.0.0

**Parameters:**

* **event** *{Object}* Событие

    * **view** *{View}* Представление

- - -

**'hide'**

Событие скрытия представления

Since: 1.0.0

**Parameters:**

* **event** *{Object}* Событие

    * **view** *{View}* Представление

- - -

**'state:visible'**

Событие изменения видимости представления

Since: 1.0.0

**Parameters:**

* **event** *{Object}* Событие

    * **view** *{View}* Представление

    * **value** *{Boolean}* Флаг видимости

- - -

**'onredraw'**

Событие перерисовки представления

Since: 1.0.2

**Parameters:**

* **event** *{Object}* Событие

    * **[states={}]** *{Object}* Хэш изменившихся состояний представления

    * **[data={}]** *{Object}* Хэш изменившихся данных модели

- - -

**'model:change'**

Событие изменения атрибутов модели или замены модели на новую

Since: 1.0.16

**Parameters:**

* **event** *{Object}* Событие

    * **model** *{Backbone.Model}* Модель представления

    * **view** *{View}* Представление

- - -

Properties:
-----

**statesModel** *{Function}* *static*

Конструктор модели состояний

default: StatesModel

Since: 1.0.6

- - -

**uid** *{Number}* *static*

Счетчик представлений

default: 0

Since: 1.0.0

- - -

**_autoRefocused** *{Boolean}* *private*

Флаг восстановления фокуса на дочернем представлении

default: null

Since: 1.0.17

- - -

**_changedModelAttributes** *{Object}* *private*

Хэш измененных данных модели, прикрепленной к представлению

default: null

Since: 1.0.0

- - -

**_changedStatesAttributes** *{Object}* *private*

Хэш измененных состояний представления

default: null

Since: 1.0.0

- - -

**_className** *{String}* *private*

Имя класса

default: 'View'

Since: 1.0.0

- - -

**_disabledClass** *{String}* *private*

Css класс для заблокированного представления

default: null

Since: 1.0.0

- - -

**_hiddenClass** *{String}* *private*

Сss класс для скрытого представления

default: 'hidden'

Since: 1.0.0

- - -

**_id** *{Number}* *private*

Id представления

default: null

Since: 1.0.0

- - -

**_initialized** *{Boolean}* *private*

Флаг инициализации

default: false

Since: 1.0.0

- - -

**_lastFocused** *{View}* *private*

Дочернее представление, на которое был передан фокус

default: null

Since: 1.0.0

- - -

**_modelIsEmpty** *{Boolean}* *private*

Флаг отсутствия модель данных

default: true

Since: 1.0.0

- - -

**_mouseEvents** *{Boolean}* *private*

Флаг поддержки мыши

default: null

Since: 1.0.9

- - -

**_parent** *{View}* *private*

Родительское представление

default: null

Since: 1.0.0

- - -

**_rememberLastFocused** *{Boolean}* *private*

Флаг передачи родителю информации, что представление получило фокус

default: null

Since: 1.0.14

- - -

**_states** *{StatesModel}* *private*

Модель состояний представления

default: null

Since: 1.0.0

- - -

**_viewManager** *{ViewManager}* *private*

Менеджер представлений

default: null

Since: 1.0.0

- - -

**_views** *{Array}* *private*

Массив дочерних представлений

default: null

Since: 1.0.0

- - -

**_waitingFrame** *{Boolean}* *private*

Флаг ожидания перерисовки

default: false

Since: 1.0.7

- - -

**events** *{Object}*

DOM события, которые обрабатываются представлением

default: {'click': '_handlerAction', 'mouseenter': 'focus'}

Since: 1.0.0

- - -

**keyHandlers** *{KeyHandlers}*

Менеджер нажатий клавиш

default: null

Since: 1.0.0

- - -

**name** *{String}*

Имя представления

default: null

Since: 1.0.0

- - -

Methods:
-----

**_handleMouseFocus**() *private*

Обрабатывает наведение мыши

Since: 1.0.9

- - -

**_handlerAction**(event) *private*

Обрабатывает действие представления

Since: 1.0.0

**Parameters:**

* **[event]** *{Object}* Событие мыши

- - -

**_initHashes**() *private*

Инициализирует хэши измененных атрибутов

Since: 1.0.0

- - -

**_initId**() *private*

Инициализирует идентификатор представления

Since: 1.0.0

- - -

**_initKeyHandlers**(navKeys) *private*

Инициализирует менеджер событий нажатия клавиш

Since: 1.0.0

**Parameters:**

* **[navKeys]** *{String}* навигационные клавиши

- - -

**_initMouseEvents**(_mouseEvents) *private*

Инициализирует поддержку мыши

Since: 1.0.9

**Parameters:**

* **[_mouseEvents=true]** *{Boolean}* Флаг поддержки мыши

- - -

**_initName**(name) *private*

Инициализирует имя представления

Since: 1.0.0

**Parameters:**

* **[name]** *{String}* Имя представления

- - -

**_initStatesModel**() *private*

Инициализирует модель состояний представления

Since: 1.0.0

- - -

**_initViewManager**(viewManager) *private*

Инициализирует менеджер представлений

Since: 1.0.0

**Parameters:**

* **viewManager** *{ViewManager}* Менеджер представлений

- - -

**_initViews**() *private*

Инициализирует хранилище дочерних представлений

Since: 1.0.0

- - -

**_invalidateModel**(init) *private*

Инвалидирует модель данных;
Метод вызывается при изменении атрибутов модели данных,
либо при задании новой модели данных;
Если представление видимо, вызывается перерисовка,
иначе ожидается изменение состояния видимости

Since: 1.0.0

**Parameters:**

* **[init=false]** *{Boolean}* Флаг, указывающий, что модель только что была задана и нужно обновить все атрибуты

- - -

**_invalidateStates**() *private*

Инвалидирует модель состояний;
Метод вызывается при изменении атрибутов модели состояний;
Если представление видимо, вызывается перерисовка,
иначе ожидается изменение состояния видимости

Since: 1.0.0

- - -

**_requestRender**() *private*

Указывает браузеру, что необходимо запланировать перерисовку на следующем кадре анимации;
Если перерисовка уже выполняется, новый запрос не составляется;
После перерисовки хэши измененных атрибутов сбрасываются

Since: 1.0.0

- - -

**_setAutoRefocused**(_autoRefocused) *private*

Устанавливает флаг восстановления фокуса на дочернем представлении

Since: 1.0.17

**Parameters:**

* **[_autoRefocused=true]** *{Boolean}* Флаг восстановления фокуса на дочернем представлении

- - -

**_setFocused**(focused, mouse) *private*

Изменяет состояние наличия фокуса на представлении;
Приватный метод. Для передачи фокуса следует использовать метод focus

Since: 1.0.0

**Parameters:**

* **focused** *{Boolean}* Текущее состояние

* **[mouse=false]** *{Boolean}* Фокус был наведен мышкой

- - -

**_setRememberingLastFocused**(_rememberLastFocused) *private*

Устанавливает флаг запоминания передачи фокуса родителем для этого представления

Since: 1.0.14

**Parameters:**

* **[_rememberLastFocused=true]** *{Boolean}* Флаг запоминания передачи фокуса родителем для этого представления

- - -

**_toggleEnabled**(enabled) *private*

Изменяет доступность представления, основываясь на состоянии доступности

Since: 1.0.0

**Parameters:**

* **enabled** *{Boolean}* Значение состояния доступности

- - -

**_toggleFocused**(focused) *private*

Переключает класс 'focused'

Since: 1.0.0

**Parameters:**

* **focused** *{Boolean}* Наличие фокуса

- - -

**_toggleVisibility**(model, visible) *private*

Изменяет видимость HTML элемента представления, основываясь на состоянии видимости

Since: 1.0.0

**Parameters:**

* **model** *{Backbone.Model}* Модель состояний представления

* **visible** *{Boolean}* Значение состояния видимости

- - -

**addView**(view)

Добавляет представление в массив дочерних представлений

Since: 1.0.0

**Parameters:**

* **view** *{View}* Представление, которое нужно добавить

- - -

**blur**()

Убирает фокус с представления

Since: 1.0.0

- - -

**deleteChild**(view)

Убирает ссылку на дочернее представление

Since: 1.0.0

**Parameters:**

* **view** *{View}* Дочернее представление

- - -

**destroy**()

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

Since: 1.0.0

- - -

**focus**(mouse)

Передает фокус на представление

Since: 1.0.0

**Parameters:**

* **[mouse=false]** *{Boolean}* Флаг передачи фокуса мышкой

- - -

**getFamilyTree**()

Получает массив родителей

Since: 1.0.0

**Return:** *{Array}* Массив представлений

- - -

**getId**()

Получает идентификатор представления

Since: 1.0.0

**Return:** *{Number}* Идентификатор представления

- - -

**getLastFocused**()

Получает дочернее представление с фокусом

Since: 1.0.0

**Return:** *{View}* Представление

- - -

**getParent**()

Получает родителя представления

Since: 1.0.0

**Return:** *{View|null}* Родитель

- - -

**getView**(name)

Ищет дочернее представление с заданным именем

Since: 1.0.0

**Parameters:**

* **name** *{String}* Имя дочернего представления

**Return:** *{View|null}* Результат поиска

- - -

**getViewAt**(index)

Ищет дочернее представление по индексу

Since: 1.0.0

**Parameters:**

* **index** *{Number}* Индекс дочернего представления

**Return:** *{View|null}* Результат поиска

- - -

**getViewManager**()

Получает менеджер представлений

Since: 1.0.0

**Return:** *{ViewManager}* Менеджер представлений

- - -

**getViews**()

Получает массив дочерних представлений

Since: 1.0.0

**Return:** *{Array}* Массив дочерних представлений

- - -

**hasData**()

Проверяет, привязани ли модель с данными

Since: 1.0.5

**Return:** *{Boolean}* Результат проверки

- - -

**hasLastFocused**()

Проверяет наличие дочернего представления с фокусом

Since: 1.0.0

**Return:** *{Boolean}* Результат проверки

- - -

**hasParent**()

Проверяет наличие родителя у представления

Since: 1.0.0

**Return:** *{Boolean}* Результат проверки

- - -

**hasViewManager**()

Проверяет наличие менеджера представлений

Since: 1.0.0

**Return:** *{Boolean}* Результат проверки

- - -

**initialize**(options)

Инициализирует представление

Since: 1.0.0

**Parameters:**

* **options** *{Object}* Параметры представления

    * **[name]** *{String}* Имя представления

    * **[parent]** *{View}* Родительское представление

    * **[viewManager]** *{ViewManager}* Менеджер представлений, не нужен для дочерних представлений

    * **[model]** *{Backbone.Model}* Модель данных

    * **[visible=true]** *{Boolean}* Первоначальное состояние видимости представления

    * **[enabled=true]** *{Boolean}* Первоначальное состояние доступности представления

    * **[navKeys]** *{String}* Клавиши направлений

    * **[mouseEvents=true]** *{Boolean}* Флаг использования мыши

    * **[rememberLastFocused=true]** *{Boolean}* Флаг запоминания передачи фокуса родителем

    * **[autoRefocused=true]** *{Boolean}* Флаг восстановления фокуса на дочернем представлении

- - -

**invalidate**()

Выполняет полную инвалидацию по запросу пользователя;
Используется, когда данные моделей не изменились, но требуется перерисовка;
Если представление видимо, вызывается перерисовка,
иначе ожидается изменение состояния видимости

Since: 1.0.0

- - -

**isAtFocus**()

Проверяет, находится ли дочернее представление в фокусе

**Return:** *{Boolean}* Результат проверки

- - -

**isAutoRefocused**()

Проверяет, восстанавливать ли фокус на дочернем представлении

Since: 1.0.17

**Return:** *{Boolean}* Результат проверки

- - -

**isEnabled**()

Проверяет, является ли представление доступным

Since: 1.0.0

**Return:** *{Boolean}* Результат проверки

- - -

**isFocused**()

Проверяет, находится ли представление в фокусе

Since: 1.0.0

**Return:** *{Boolean}* Результат проверки

- - -

**isInitialized**()

Проверяет инициализировано ли представление

Since: 1.0.0

**Return:** *{Boolean}* Результат проверки

- - -

**isMouseSupported**()

Проверяет поддержку мыши

Since: 1.0.9

**Return:** *{Boolean}* Результат проверки

- - -

**isVisible**()

Проверяет, является ли представление видимым

Since: 1.0.0

**Return:** *{Boolean}* Результат проверки

- - -

**remembersLastFocused**()

Проверяет должен ли родитель запоминать передачу фокуса для этого представления

Since: 1.0.14

**Return:** *{Boolean}* Результат проверки

- - -

**render**()

Перерисовывает представление

Since: 1.0.0

- - -

**setAtFocus**(atfocus, mouse)

Изменяет состояние наличия фокуса на представлении или дочерних представлениях;
Метод не должен использоваться. Он сделан публичным для обращения менеджера представлений

Since: 1.0.0

**Parameters:**

* **atfocus** *{Boolean}* Текущее состояние

* **mouse** *{Boolean}* Флаг изменения фокуса мышкой

- - -

**setEnabled**(enabled)

Изменяет состояние доступности представления

Since: 1.0.0

**Parameters:**

* **[enabled]** *{Boolean}* Новое значение доступности

- - -

**setLastFocused**(view, toParent)

Сохраняет дочернее представление с фокусом и прокидывает себя наверх

Since: 1.0.0

**Parameters:**

* **view** *{View}* Дочернее представление

* **[toParent=true]** *{Boolean}* Флаг передачи действия дальше по цепочке (родителю)

- - -

**setModel**(model, force)

Задает модель данных представления

Since: 1.0.0

**Parameters:**

* **model** *{Backbone.Model|null}* Модель данных

* **force** *{Boolean}* Флаг принудительного задания модели

- - -

**setParent**(parent)

Задает родителя представлению

Since: 1.0.0

**Parameters:**

* **parent** *{View}* Родитель

- - -

**setVisible**(visible)

Изменяет состояние видимости представления

Since: 1.0.0

**Parameters:**

* **[visible]** *{Boolean}* Новое значение видимости

- - -

**toString**()

Преобразует представление в строку

Since: 1.0.0

**Return:** *{String}* Результат преобразования

- - -

ViewManager
=====

Since: 1.0.0

Менеджер представлений

constructor
-----

**ViewManager**(runtime, target)

Менеджер представлений

Since: 1.0.0

**Parameters:**

* **runtime** *{Runtime}* Runtime платформы

* **[target=window]** *{Object}* Объект, на котором будут слушаться нажатия клавиш

- - -

Events:
-----

**'keypress'**

Событие нажатия на клавишу

Since: 1.0.0

**Parameters:**

* **event** *{Object}* Событие

    * **keyId** *{String}* Нажатая клавиша

    * **target** *{View}* Представление, на котором произошло нажатие клавиши

    * **originalEvent** *{Object}* Первоначальное событие DOM

    * **bubbling** *{Boolean}* Флаг всплывающего события

- - -

**'focus:change'**

Событие изменения текущего представления в фокусе

Since: 1.0.0

**Parameters:**

* **event** *{Object}* Событие

    * **[prev]** *{View}* Предыдущее представление

    * **[next]** *{View}* Новое представление

- - -

**'focus:end'**

Событие невозможности перевести фокус в заданном направлении

Since: 1.0.3

**Parameters:**

* **event** *{Object}* Событие

    * **view** *{View}* Представление, запросившее перевод фокуса

    * **dir** *{View}* Направление перевода фокуса

- - -

Properties:
-----

**_focusTarget** *{View}* *private*

Текущее представление, для которого будут слаться события

default: null

Since: 1.0.0

- - -

**_keyLock** *{Boolean}* *private*

Флаг блокировки клавиш

default: null

Since: 1.1.2

- - -

**focusLocker** *{View}* *private*

Представление, ограничивающее передвижение фокуса собой

Since: 1.1.0

- - -

Methods:
-----

**_findNext**(view, dir) *private*

Ищет доступное представление по заданному направлению

Since: 1.0.0

**Parameters:**

* **view** *{View}* Представление, относительно которого производится поиск

* **dir** *{String}* Направление поиска

**Return:** *{View}* Результат поиска

- - -

**_getNeighbour**([String}) *private*

Получает связанное представление

Since: 1.0.0

**Parameters:**

* **[String}** dir Направление, в котором находится другое представление

**Return:** *{View}* Связанное представление

- - -

**_getNeighbours**() *private*

Получает связанные представления по всем направлениям

Since: 1.0.0

**Return:** *{Object}* Пары направление / представление

- - -

**_setNeighbour**(dir, view) *private*

Устанавливает связь представления с другим

Since: 1.0.0

**Parameters:**

* **dir** *{String}* Направление, в котором находится другое представление

* **view** *{View}* Представление, которое надо привязать

- - -

**_handleKeypress**(keyId, event)

Обрабатывает нажатие клавиши, рассылает соответствующие события

Since: 1.0.0

**Parameters:**

* **keyId** *{String}* Название клавиши

* **event** *{Object}* Параметры первоначального DOM события

- - -

**deleteView**(view)

Удаляет связи представление, а также само представление из связей

Since: 1.0.0

**Parameters:**

* **view** *{View}* Представление для удаления

- - -

**getFocusLocker**()

Получает ограничитель фокуса

Since: 1.1.0

**Return:** *{View}* 

- - -

**getFocusTarget**()

Получает текущее представление

Since: 1.0.0

**Return:** *{View}* Текущее представление

- - -

**grid**(views, colsNum)

Связывает представления сеткой

Since: 1.0.0

**Parameters:**

* **views** *{Array}* Набор представлений

* **colsNum** *{Number}* Количество столбцов в сетке

- - -

**hasFocusTarget**()

Проверяет наличие текущего представления

Since: 1.0.0

**Return:** *{Boolean}* Результат проверки

- - -

**keysAreLocked**()

Проверяет состояние блокировки клавиш

Since: 1.1.2

**Return:** *{Boolean}* Результат проверки

- - -

**leftToRight**(views, looped)

Связывает представления слева направо

Since: 1.0.0

**Parameters:**

* **views** *{Array}* Набор представлений

* **[looped=false]** *{Boolean}* Флаг замкнутости набора

- - -

**leftToRightLoop**(views)

Связывает представления слева направо c замыканием концов

Since: 1.0.0

**Parameters:**

* **views** *{Array}* Набор представлений

- - -

**lockKeys**(lock)

Блокирует клавиши

Since: 1.1.2

**Parameters:**

* **[lock=true]** *{Boolean}* Состояние блокировки

- - -

**moveFocus**(view, dir, origin)

Перемещает фокус по заданному направлению

Since: 1.0.0

**Parameters:**

* **view** *{View}* Представление, относительно которого смещается фокус

* **dir** *{String}* Направление смещения фокуса

* **[origin=null]** *{View}* Первоначальное представление, инициализировавшее передачу фокуса

- - -

**setFocusLocker**(focusLocker)

Устанавливает ограничитель фокуса

Since: 1.1.0

**Parameters:**

* **focusLocker** *{View}* Представление, ограничивающее передвижение фокуса собой

- - -

**setFocusTarget**(view, mouse)

Устанавливает текущее представление и убирает фокус со старого, если имеется

Since: 1.0.0

**Parameters:**

* **view** *{View}* Новое представление

* **mouse** *{Boolean}* Флаг передачи фокуса мышкой

- - -

**topToBottom**(views, looped)

Связывает представления сверху вниз

Since: 1.0.0

**Parameters:**

* **views** *{Array}* Набор представлений

* **[looped=false]** *{Boolean}* Флаг замкнутости набора

- - -

**topToBottomLoop**(views)

Связывает представления сверху вниз c замыканием концов

Since: 1.0.0

**Parameters:**

* **views** *{Array}* Набор представлений

- - -

**unlockKeys**()

Разблокирует клавиши

Since: 1.1.2

- - -

**unsetFocusLocker**()

Снимает ограничитель фокуса

Since: 1.1.0

- - -

KeyHandlers
=====

Since: 1.0.0

Менеджер событий нажатия клавиш

constructor
-----

**KeyHandlers**(view)

Менеджер событий нажатия клавиш

Since: 1.0.0

**Parameters:**

* **view** *{View}* Представление, к которому будет привязан менеджер

- - -

Properties:
-----

**_handlers** *{Object}* *private*

Набор обработчиков для различных клавиш

default: {}

Since: 1.0.0

- - -

**_view** *{View}* *private*

Представление, к которому привязан менеджер

default: null

Since: 1.0.0

- - -

Methods:
-----

**_handlerKeypress**(event, callback) *private*

Осуществляет вызов обработчиков для события, основываясь на нажатой клавише;
Также генерирует события на представлении

Since: 1.0.0

**Parameters:**

* **event** *{Object}* Событие

    * **keyId** *{String}* Нажатая клавиша

    * **target** *{View}* Представление, на котором произошло нажатие клавиши

    * **originalEvent** *{Object}* Первоначальное событие DOM

    * **bubbling** *{Boolean}* Флаг всплывающего события

* **callback** *{Function}* Функция обратного вызова

- - -

**add**(keys, handler, context)

Добавляет обработчики для указанных клавиш

Since: 1.0.0

**Parameters:**

* **keys** *{String}* Список клавиш, разделенных пробелом

* **handler** *{Function}* Обрыботчик для клавиш

* **[context=null]** *{View}* Контекст обработчика

**Throws:** *{Error}* Не указан обработчик

- - -

**destroy**()

Убирает все ссылки внутри менеджера, оставляя его наедине со сборщиком мусора

Since: 1.0.0

- - -

**remove**(keys, callback, context)

Удаляет обработчики по заданным критериям: клавиша, обработчик, контекст

Since: 1.0.0

**Parameters:**

* **[keys=null]** *{String}* Список клавиш, для которых следует удалить обработчики

* **[callback=null]** *{Function}* Обработчик, который следует удалить

* **[context=null]** *{View}* Контекст, для которого следует удалить обработчик

- - -

StatesModel
=====

Extends: Backbone.Model

Since: 1.0.0

Базовая модель состояний представления

Properties:
-----

**atfocus** *{Boolean}* *private*

Состояние наличия фокуса на дочернем представлении

default: false

Since: 1.0.0

- - -

**enabled** *{Boolean}* *private*

Состояние доступности

default: true

Since: 1.0.0

- - -

**focused** *{Boolean}* *private*

Состояние наличия фокуса

default: false

Since: 1.0.0

- - -

**visible** *{Boolean}* *private*

Состояние видимости

default: true

Since: 1.0.0

- - -
