var _clone = require('lodash/clone'),
KeyHandlers = require('../../../lib/handlers/KeyHandlers'),
ViewManager = require('../../../lib/handlers/ViewManager'),
View = require('../../../lib/views/View'),
ViewEvents = require('../../../lib/events/View'),
StatesModel = require('../../../lib/models/StatesModel'),
BrowserKeyCodeMap = require('../../../lib/helpers/BrowserKeyCodeMap'),
EmulateEvent = require('../../mock/DOMEventsEmulator');

requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
    return setTimeout(callback, 1);
};

describe('views/View', function() {
    beforeEach(function() {
        return this.vm = new ViewManager(BrowserKeyCodeMap);
    });

    describe('initialize', function() {
        it('creates id', function() {
            var view;
            view = new View({
                tagName: 'div'
            });
            expect(view._id).toBe(View.uid - 1);
        });

        describe('naming', function() {
            it('creates name', function() {
                var view;
                view = new View({
                    tagName: 'div'
                });
                expect(view.name).toBe("" + View.prototype._className + "-" + (View.uid - 1));
            });

            it('sets user-generated name', function() {
                var view;
                view = new View({
                    tagName: 'div',
                    name: 'testView'
                });
                expect(view.name).toBe('testView');
            });

            it('adds id to name', function() {
                var view;
                view = new View({
                    tagName: 'div',
                    name: 'testView-@@'
                });
                expect(view.name).toBe("testView-" + (View.uid - 1));
            });
        });

        it('adds view manager', function() {
            var view;
            view = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            expect(view._viewManager).toBe(this.vm);
        });

        it('inits views', function() {
            var view;
            view = new View({
                tagName: 'div'
            });
            expect(view._views).toEqual([]);
        });

        it('inits hashes', function() {
            var view;
            view = new View({
                tagName: 'div'
            });
            expect(view._changedModelAttributes).toEqual({});
            expect(view._changedStatesAttributes).toEqual(jasmine.any(Object));
        });

        it('inits states model', function() {
            var view;
            view = new View({
                tagName: 'div'
            });
            expect(view._states instanceof StatesModel).toBeTruthy();
        });

        it('inits key handlers', function() {
            var view;
            spyOn(this.vm, 'moveFocus');
            view = new View({
                tagName: 'div',
                viewManager: this.vm,
                navKeys: 'left'
            });
            expect(view.keyHandlers instanceof KeyHandlers).toBeTruthy();
            view.keyHandlers._handleKeypress({
                keyId: 'left'
            }, function() {});
            expect(this.vm.moveFocus).toHaveBeenCalledWith(view, 'left');
        });
    });

    describe('parents', function() {
        it('sets parent', function() {
            var view, view2, view3;
            view = new View({
                tagName: 'div'
            });
            view2 = new View({
                parent: view,
                tagName: 'div'
            });
            view3 = new View({
                tagName: 'div'
            });
            expect(view2._parent).toBe(view);
            expect(view._views.indexOf(view2)).toBeGreaterThan(-1);
            view2.setParent(view3);
            expect(view2._parent).toBe(view3);
            expect(view3._views.indexOf(view2)).toBeGreaterThan(-1);
            expect(view._views.indexOf(view2)).toBe(-1);
        });

        it('checks parent', function() {
            var view, view2;
            view = new View({
                tagName: 'div'
            });
            view2 = new View({
                tagName: 'div'
            });
            expect(view2.hasParent()).toBeFalsy();
            view2.setParent(view);
            expect(view2.hasParent()).toBeTruthy();
        });

        it('returns parent', function() {
            var view, view2;
            view = new View({
                tagName: 'div'
            });
            view2 = new View({
                tagName: 'div'
            });
            expect(view2.getParent()).toBeNull();
            view2.setParent(view);
            expect(view2.getParent()).toBe(view);
        });

        it('forms family array', function() {
            var view, view2;
            view = new View({
                tagName: 'div'
            });
            view2 = new View({
                parent: view,
                tagName: 'div'
            });
            expect(view.getFamilyTree()).toEqual([view]);
            expect(view2.getFamilyTree()).toEqual([view, view2]);
        });

        it('converts to string', function() {
            var view, view2;
            view = new View({
                tagName: 'div'
            });
            view2 = new View({
                parent: view,
                tagName: 'div'
            });
            expect(view.toString()).toBe(view.name);
            expect(view2.toString()).toBe("" + view.name + "/" + view2.name);
        });
    });

    describe('view manager', function() {
        it('checks view manager', function() {
            var view, view2;
            view = new View({
                tagName: 'div'
            });
            view2 = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            expect(view.hasViewManager()).toBeFalsy();
            expect(view2.hasViewManager()).toBeTruthy();
        });

        it('returns view manager', function() {
            var view, view2;
            view = new View({
                tagName: 'div'
            });
            view2 = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            expect(view.getViewManager()).toBeNull();
            expect(view2.getViewManager()).toBe(this.vm);
        });

        it('gets view manager from parent', function() {
            var view, view2;
            view = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            view2 = new View({
                tagName: 'div',
                parent: view
            });
            expect(view.getViewManager()).toBe(this.vm);
            expect(view2.getViewManager()).toBe(this.vm);
        });
    });

    describe('children', function() {
        beforeEach(function() {
            this.view = new View({
                tagName: 'div'
            });
            this.view2 = new View({
                parent: this.view,
                tagName: 'div'
            });
            return this.view3 = new View({
                parent: this.view,
                tagName: 'div'
            });
        });

        it('returns children', function() {
            expect(this.view.getViews()).toEqual([this.view2, this.view3]);
        });

        it('searches view by name', function() {
            var view;
            view = this.view.getView(this.view3.name);
            expect(view).toBe(this.view3);
        });

        it('searches view by index', function() {
            var view;
            view = this.view.getViewAt(1);
            expect(view).toBe(this.view3);
        });

        it('adds view to children', function() {
            expect(this.view.getViews().indexOf(this.view2)).toBeGreaterThan(-1);
        });

        it('removes view from children', function() {
            this.view.deleteChild(this.view2);
            expect(this.view.getViews().indexOf(this.view2)).toBe(-1);
            expect(this.view.getViews()).toEqual([this.view3]);
        });
    });

    describe('last focused', function() {
        beforeEach(function() {
            this.view = new View({
                tagName: 'div'
            });
            this.view2 = new View({
                parent: this.view,
                tagName: 'div'
            });
            return this.view3 = new View({
                parent: this.view2,
                tagName: 'div'
            });
        });

        it('sets last focused', function() {
            expect(this.view2._lastFocused).toBeNull();
            this.view2.setLastFocused(this.view3);
            expect(this.view2._lastFocused).toBe(this.view3);
        });

        it('chain reaction', function() {
            this.view3.focus();
            expect(this.view._lastFocused).toBe(this.view2);
            expect(this.view2._lastFocused).toBe(this.view3);
        });

        it('checks last focused', function() {
            expect(this.view2.hasLastFocused()).toBeFalsy();
            this.view2.setLastFocused(this.view3);
            expect(this.view2.hasLastFocused()).toBeTruthy();
        });

        it('returns last focused', function() {
            expect(this.view2.getLastFocused()).toBeNull();
            this.view2.setLastFocused(this.view3);
            expect(this.view2.getLastFocused()).toBe(this.view3);
        });
    });

    describe('auto refocused', function() {
        it('handles focus restoration', function() {
            var view, view2, view3;
            view = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            view2 = new View({
                tagName: 'div',
                parent: view,
                autoRefocused: false
            });
            view3 = new View({
                tagName: 'div',
                parent: view2
            });
            debugger;
            view.focus();
            expect(view3.isAtFocus()).toBeFalsy();
            expect(view2.isAtFocus()).toBeTruthy();
        });
    });

    describe('mouse', function() {
        it('mouseclick', function() {
            var callback, view;
            callback = jasmine.createSpy('callback');
            view = new View({
                tagName: 'div'
            });
            view.on(ViewEvents['ACTION'], callback);
            view.$el.click();
            expect(callback).toHaveBeenCalled();
        });

        xit('mouseenter', function() {
            var view, view2;
            view = new View({
                tagName: 'div'
            });
            spyOn(view, '_setFocused').and.callThrough();
            view2 = new View({
                parent: view,
                tagName: 'div'
            });
            spyOn(view2, '_setFocused').and.callThrough();
            EmulateEvent(view2.$el.get(0), 'mouseenter');
            expect(view2._setFocused).toHaveBeenCalled();
            expect(view._setFocused).not.toHaveBeenCalled();
        });
    });

    describe('render', function() {
        it('invalidates data on initialize', function(done) {
            var states, view;
            spyOn(View.prototype, 'invalidate').and.callThrough();
            spyOn(View.prototype, '_requestRender').and.callThrough();
            spyOn(View.prototype, 'render').and.callThrough();
            view = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            expect(View.prototype.invalidate).toHaveBeenCalled();
            states = _clone(view._states.attributes);
            delete states.visible;
            expect(view._changedStatesAttributes).toEqual(states);
            expect(view._changedModelAttributes).toEqual({});
            expect(view._modelIsEmpty).toBeTruthy();
            expect(View.prototype._requestRender).toHaveBeenCalled();
            return requestAnimationFrame((function(_this) {
                return function() {
                    expect(View.prototype.render).toHaveBeenCalled();
                    return done();
                };
            })(this));
        });

        it('renders data on state change', function(done) {
            var view;
            spyOn(View.prototype, 'render').and.callThrough();
            view = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            return requestAnimationFrame((function(_this) {
                return function() {
                    view.focus();
                    return requestAnimationFrame(function() {
                        expect(View.prototype.render).toHaveBeenCalled();
                        expect(View.prototype.render.calls.count()).toBe(2);
                        expect(view.$el.hasClass('focused')).toBeTruthy();
                        return done();
                    });
                };
            })(this));
        });

        it('renders only when visible', function(done) {
            var view;
            spyOn(View.prototype, 'render').and.callThrough();
            view = new View({
                tagName: 'div',
                viewManager: this.vm,
                visible: false
            });
            return requestAnimationFrame((function(_this) {
                return function() {
                    expect(view.$el.hasClass(View.prototype._hiddenClass)).toBeTruthy();
                    view.focus();
                    view.setVisible(true);
                    return requestAnimationFrame(function() {
                        expect(View.prototype.render).toHaveBeenCalled();
                        expect(View.prototype.render.calls.count()).toBe(1);
                        expect(view.$el.hasClass('focused')).toBeTruthy();
                        expect(view.$el.hasClass(View.prototype._hiddenClass)).toBeFalsy();
                        return done();
                    });
                };
            })(this));
        });

        it('throws render event', function(done) {
            var callback, view;
            callback = jasmine.createSpy('callback');
            view = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            view.on(ViewEvents['RENDER'], callback);
            view.focus();
            return requestAnimationFrame((function(_this) {
                return function() {
                    expect(callback).toHaveBeenCalled();
                    expect(callback.calls.count()).toBe(1);
                    expect(callback).toHaveBeenCalledWith({
                        states: {
                            enabled: true,
                            focused: true,
                            atfocus: true
                        },
                        data: {}
                    });
                    return done();
                };
            })(this));
        });

        it('sets classes', function(done) {
            var test, view, view2, view3, view4, view5, views, _i, _len;
            view = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            view2 = new View({
                parent: view,
                tagName: 'div',
                viewManager: this.vm
            });
            view3 = new View({
                parent: view2,
                tagName: 'div',
                viewManager: this.vm
            });
            view4 = new View({
                parent: view3,
                tagName: 'div',
                viewManager: this.vm,
                navKeys: 'up down'
            });
            view5 = new View({
                parent: view3,
                tagName: 'div',
                viewManager: this.vm,
                navKeys: 'up down'
            });
            this.vm.topToBottom([view4, view5]);
            views = [view, view2, view3, view4, view5];
            for (_i = 0, _len = views.length; _i < _len; _i++) {
                test = views[_i];
                expect(test.isFocused()).toBeFalsy();
                expect(test.isAtFocus()).toBeFalsy();
                expect(test.$el.hasClass('focused')).toBeFalsy();
            }
            view4.focus();
            return requestAnimationFrame((function(_this) {
                return function() {
                    var command, _j, _len1;
                    for (_j = 0, _len1 = views.length; _j < _len1; _j++) {
                        test = views[_j];
                        if (test !== view5) {
                            command = 'toBeTruthy';
                        } else {
                            command = 'toBeFalsy';
                        }
                        if (test === view4) {
                            expect(test.isFocused()).toBeTruthy();
                        } else {
                            expect(test.isFocused()).toBeFalsy();
                        }
                        expect(test.isAtFocus())[command]();
                        expect(test.$el.hasClass('focused'))[command]();
                    }
                    _this.vm._handleKeypress('down', {});

                    requestAnimationFrame(function() {
                        var _k, _len2;
                        for (_k = 0, _len2 = views.length; _k < _len2; _k++) {
                            test = views[_k];
                            if (test !== view4) {
                                command = 'toBeTruthy';
                            } else {
                                command = 'toBeFalsy';
                            }
                            if (test === view5) {
                                expect(test.isFocused()).toBeTruthy();
                            } else {
                                expect(test.isFocused()).toBeFalsy();
                            }
                            expect(test.isAtFocus())[command]();
                            expect(test.$el.hasClass('focused'))[command]();
                        }
                        return done();
                    });
                };
            })(this));
        });
    });

    it('destroys', function() {
        var test, view, view2, view3, view4, _i, _len, _ref, _results;
        view = new View({
            tagName: 'div'
        });
        view2 = new View({
            parent: view,
            tagName: 'div'
        });
        view3 = new View({
            parent: view,
            tagName: 'div'
        });
        view4 = new View({
            parent: view3,
            tagName: 'div'
        });
        view4.focus();
        view.destroy();
        _ref = [view, view2, view3, view4];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            test = _ref[_i];
            (function(test) {
                expect(test.getViewManager()).toBeNull();
                expect(test.getParent()).toBeNull();
                expect(test.getViews()).toEqual([]);
                expect(test._states).toBeNull();
                expect(test.keyHandlers).toBeNull();
                expect(test._lastFocused).toBeNull();
            })(test);
        }
    });
});
