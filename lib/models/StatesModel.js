var Backbone = require('backbone'),
    StatesModel;

/**
 Базовая модель состояний представления

 @class StatesModel
 @extends Backbone.Model
 @since 1.0.0
 */
StatesModel = Backbone.Model.extend({
    defaults: {

        /**
         Состояние видимости

         @attribute visible
         @type Boolean
         @default true
         @private
         @since 1.0.0
         */
        visible: true,

        /**
         Состояние доступности

         @attribute enabled
         @type Boolean
         @default true
         @private
         @since 1.0.0
         */
        enabled: true,

        /**
         Состояние наличия фокуса

         @attribute focused
         @type Boolean
         @default false
         @private
         @since 1.0.0
         */
        focused: false,

        /**
         Состояние наличия фокуса на дочернем представлении

         @attribute atfocus
         @type Boolean
         @default false
         @private
         @since 1.0.0
         */
        atfocus: false
    }
});

module.exports = StatesModel;
