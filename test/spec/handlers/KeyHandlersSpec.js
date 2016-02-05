var KeyEvents = require('../../../lib/events/Key'),
    KeyHandlers = require('../../../lib/handlers/KeyHandlers'),
    View = require('../../../lib/views/View');

describe('handlers/KeyHandlers', function() {
    beforeEach(function() {
        this.view = new View({
            tagName: 'div'
        });
        this.keyHandlers = new KeyHandlers(this.view);
    });

    describe('setting handlers', function() {
        it('throws an error if keys are not specified', function() {
            var ex, fail;
            fail = jasmine.createSpy('fail');
            try {
                this.keyHandlers.add();
            } catch (_error) {
                ex = _error;
                fail(ex.message);
            }
            expect(fail).toHaveBeenCalledWith('KeyHandlers.add: keys are required');
        });

        it('throws an error if handlers is not specified', function() {
            var ex, fail;
            fail = jasmine.createSpy('fail');
            try {
                this.keyHandlers.add('left');
            } catch (_error) {
                ex = _error;
                fail(ex.message);
            }
            expect(fail).toHaveBeenCalledWith('KeyHandlers.add: handler is required');
        });

        it('for one key', function() {
            var handler;
            handler = function() {
                return true;
            };
            this.keyHandlers.add('left', handler);
            expect(this.keyHandlers._handlers).toEqual(jasmine.any(Object));
            expect(this.keyHandlers._handlers.left).toEqual(jasmine.any(Array));
            expect(this.keyHandlers._handlers.left.length).toBe(1);
            expect(this.keyHandlers._handlers.left[0]).toEqual([handler, null]);
            expect(this.keyHandlers._handlers.left[0][0]).toBe(handler);
        });

        it('for any number of keys', function() {
            var handler, i, key, keys, rnd, _i, _len, _results;
            handler = function() {
                return true;
            };
            rnd = 2 + Math.floor(Math.random() * 10);
            keys = (function() {
                var _i, _results;
                _results = [];
                for (i = _i = 0; 0 <= rnd ? _i < rnd : _i > rnd; i = 0 <= rnd ? ++_i : --_i) {
                    _results.push("key-" + i);
                }
                return _results;
            })();
            this.keyHandlers.add(keys.join(' '), handler);
            _results = [];
            for (_i = 0, _len = keys.length; _i < _len; _i++) {
                key = keys[_i];
                expect(this.keyHandlers._handlers).toEqual(jasmine.any(Object));
                expect(this.keyHandlers._handlers[key]).toEqual(jasmine.any(Array));
                expect(this.keyHandlers._handlers[key].length).toBe(1);
                expect(this.keyHandlers._handlers[key][0]).toEqual([handler, null]);
                _results.push(expect(this.keyHandlers._handlers[key][0][0]).toBe(handler));
            }
            return _results;
        });

        it('with specific context', function() {
            var context, handler;
            handler = function() {
                return true;
            };
            context = {
                test: true
            };
            this.keyHandlers.add('left', handler, context);
            expect(this.keyHandlers._handlers).toEqual(jasmine.any(Object));
            expect(this.keyHandlers._handlers.left).toEqual(jasmine.any(Array));
            expect(this.keyHandlers._handlers.left.length).toBe(1);
            expect(this.keyHandlers._handlers.left[0]).toEqual([handler, context]);
            expect(this.keyHandlers._handlers.left[0][1]).toBe(context);
        });
    });

    describe('removing handlers', function() {
        beforeEach(function() {
            var ctx, ctxs, keys, _i, _len, _results;
            this.handler1 = function() {
                return true;
            };
            this.handler2 = function() {
                return false;
            };
            this.handler3 = function() {
                return 1;
            };
            this.handler4 = function() {
                return 0;
            };
            this.context1 = {
                test: true
            };
            this.context2 = {
                test: false
            };
            this.context3 = {
                test: 1
            };
            this.context4 = {
                test: 0
            };
            this.keys = ['left', 'right'];
            keys = this.keys.join(' ');
            ctxs = [null, this.context1, this.context2, this.context3, this.context4];
            _results = [];
            for (_i = 0, _len = ctxs.length; _i < _len; _i++) {
                ctx = ctxs[_i];
                this.keyHandlers.add(keys, this.handler1, ctx);
                this.keyHandlers.add(keys, this.handler2, ctx);
                this.keyHandlers.add(keys, this.handler3, ctx);
                _results.push(this.keyHandlers.add(keys, this.handler4, ctx));
            }
            return _results;
        });

        it('for specific key', function() {
            this.keyHandlers.remove('left');
            expect(this.keyHandlers._handlers.left).toBeNull();
            expect(this.keyHandlers._handlers.right).toBeDefined();
            expect(this.keyHandlers._handlers.right.length).toBe(20);
        });

        it('for all keys', function() {
            this.keyHandlers.remove();
            expect(this.keyHandlers._handlers.left).toBeNull();
            expect(this.keyHandlers._handlers.right).toBeNull();
        });

        it('for specific handler', function() {
            this.keyHandlers.remove(null, this.handler1);
            expect(this.keyHandlers._handlers.left).toBeDefined();
            expect(this.keyHandlers._handlers.right).toBeDefined();
            expect(this.keyHandlers._handlers.left.length).toBe(15);
            expect(this.keyHandlers._handlers.right.length).toBe(15);
        });

        it('with specific context', function() {
            this.keyHandlers.remove(null, null, this.context1);
            expect(this.keyHandlers._handlers.left).toBeDefined();
            expect(this.keyHandlers._handlers.right).toBeDefined();
            expect(this.keyHandlers._handlers.left.length).toBe(16);
            expect(this.keyHandlers._handlers.right.length).toBe(16);
        });

        it('with view context', function() {
            this.keyHandlers.remove(null, null, this.view);
            expect(this.keyHandlers._handlers.left).toBeDefined();
            expect(this.keyHandlers._handlers.right).toBeDefined();
            expect(this.keyHandlers._handlers.left.length).toBe(16);
            expect(this.keyHandlers._handlers.right.length).toBe(16);
        });
    });

    describe('keypress handle', function() {
        it('calls callback function', function() {
            var callback;
            callback = jasmine.createSpy('callback');
            this.view.trigger(KeyEvents['KEY_CB'], {
                keyId: 'anykey'
            }, callback);
            expect(callback).toHaveBeenCalled();
        });

        it('triggers keypress events', function() {
            var event, handler1, handler2;
            handler1 = jasmine.createSpy('handler1');
            handler2 = jasmine.createSpy('handler2');
            event = {
                keyId: 'forward'
            };
            this.view.on(KeyEvents['KEY_PRESS'], handler1);
            this.view.on('keypress:forward', handler2);
            this.view.trigger(KeyEvents['KEY_CB'], event, function() {});
            expect(handler1).toHaveBeenCalledWith(event);
            expect(handler2).toHaveBeenCalledWith(event);
        });

        it('calls handlers', function() {
            var event, handler;
            handler = jasmine.createSpy('handler');
            event = {
                keyId: 'forward'
            };
            this.keyHandlers.add('forward', handler);
            this.view.trigger(KeyEvents['KEY_CB'], event, function() {});
            expect(handler).toHaveBeenCalledWith(event);
        });

        it('calls handlers with default context', function() {
            var event, handler, resultSpy, view;
            view = this.view;
            resultSpy = jasmine.createSpy('resultSpy');
            handler = function() {
                return resultSpy(this === view);
            };
            event = {
                keyId: 'forward'
            };
            this.keyHandlers.add('forward', handler);
            this.view.trigger(KeyEvents['KEY_CB'], event, function() {});
            expect(resultSpy).toHaveBeenCalledWith(true);
        });

        it('calls handlers with specific context', function() {
            var context, event, handler, resultSpy;
            context = {
                test: true
            };
            resultSpy = jasmine.createSpy('resultSpy');
            handler = function() {
                return resultSpy(this === context);
            };
            event = {
                keyId: 'forward'
            };
            this.keyHandlers.add('forward', handler, context);
            this.view.trigger(KeyEvents['KEY_CB'], event, function() {});
            expect(resultSpy).toHaveBeenCalledWith(true);
        });
    });

    it('removes links', function() {
        var handlers;
        handlers = this.keyHandlers._handlers;
        this.keyHandlers.destroy();
        expect(this.keyHandlers._view).toBeUndefined();
        expect(this.keyHandlers._handlers).toBeUndefined();
        expect(handlers).toEqual({});
    });
});
