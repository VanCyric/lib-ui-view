var _flatten = require('lodash/flatten'),
    KeyEvents = require('../../../lib/events/Key'),
    VMEvents = require('../../../lib/events/ViewManager'),
    VMHelpers = require('../../../lib/helpers/ViewManager'),
    ViewManager = require('../../../lib/handlers/ViewManager'),
    View = require('../../../lib/views/View'),
    BrowserKeyCodeMap = require('../../../lib/helpers/BrowserKeyCodeMap');

describe('handlers/ViewManager', function() {
    beforeEach(function() {
        this.vm = new ViewManager(BrowserKeyCodeMap);
    });

    describe('keypresses', function() {
        xit('listen window events', function() {});

        it('triggers own event', function() {
            var callback;
            callback = jasmine.createSpy('callback');
            this.vm.on(KeyEvents['KEY_PRESS_VM'], callback);
            this.vm._handleKeypress('left', {
                test: true
            });
            expect(callback).toHaveBeenCalledWith({
                keyId: 'left',
                target: null,
                originalEvent: {
                    test: true
                },
                bubbling: true
            });
        });

        it('triggers event on view', function() {
            var callback, result, view;
            result = jasmine.createSpy('result');
            callback = function() {
                var args;
                args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
                return result.apply(window, args);
            };
            view = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            view.keyHandlers.add('left', callback);
            view.focus();
            this.vm._handleKeypress('left', {
                test: true
            });
            expect(result).toHaveBeenCalledWith({
                keyId: 'left',
                target: view,
                originalEvent: {
                    test: true
                },
                bubbling: true
            });
        });

        it('triggers event on views family', function() {
            var allArgs, args, callback, counter, i, parent, result, view, views, _i, _ref;
            counter = 10;
            result = jasmine.createSpy('result');
            callback = function() {
                var args;
                args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
                return result.apply(window, args);
            };
            views = [];
            for (i = _i = 0; 0 <= counter ? _i < counter : _i > counter; i = 0 <= counter ? ++_i : --_i) {
                parent = (_ref = views[i - 1]) != null ? _ref : null;
                view = new View({
                    parent: parent,
                    tagName: 'div',
                    viewManager: this.vm
                });
                view.keyHandlers.add('left', callback);
                views.push(view);
            }
            view = views[views.length - 1];
            view.focus();
            this.vm._handleKeypress('left', {
                test: true
            });
            args = {
                keyId: 'left',
                target: view,
                originalEvent: {
                    test: true
                },
                bubbling: true
            };
            allArgs = (function() {
                var _j, _results;
                _results = [];
                for (i = _j = 0; 0 <= counter ? _j < counter : _j > counter; i = 0 <= counter ? ++_j : --_j) {
                    _results.push([args]);
                }
                return _results;
            })();
            expect(result.calls.allArgs()).toEqual(allArgs);
        });

        it('stops event spreading if it is not bubbling', function() {
            var allArgs, args, callback, callback2, counter, i, parent, result, view, views, _i, _ref;
            counter = 10;
            result = jasmine.createSpy('result');
            callback = function(event) {
                return result.call(window, event);
            };
            callback2 = function(event) {
                event.bubbling = false;
                return result.call(window, event);
            };
            views = [];
            for (i = _i = 0; 0 <= counter ? _i < counter : _i > counter; i = 0 <= counter ? ++_i : --_i) {
                parent = (_ref = views[i - 1]) != null ? _ref : null;
                view = new View({
                    parent: parent,
                    tagName: 'div',
                    viewManager: this.vm
                });
                if (i === counter - 5) {
                    view.keyHandlers.add('left', callback2);
                } else {
                    view.keyHandlers.add('left', callback);
                }
                views.push(view);
            }
            view = views[views.length - 1];
            view.focus();
            this.vm._handleKeypress('left', {
                test: true
            });
            args = {
                keyId: 'left',
                target: view,
                originalEvent: {
                    test: true
                },
                bubbling: false
            };
            allArgs = (function() {
                var _j, _ref1, _results;
                _results = [];
                for (i = _j = 0, _ref1 = counter - 5; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
                    _results.push([args]);
                }
                return _results;
            })();
            expect(result.calls.allArgs()).toEqual(allArgs);
        });
    });

    describe('focus target', function() {
        it('sets focus target', function() {
            var callback, result, view, view2;
            expect(this.vm.getFocusTarget()).toBeNull();
            result = jasmine.createSpy('result');
            callback = function(event) {
                return result.call(window, event);
            };
            view = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            view.focus();
            expect(this.vm.getFocusTarget()).toBe(view);
            this.vm.on(VMEvents['VM_FOCUS_CHANGE'], callback);
            view2 = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            view2.focus();
            expect(this.vm.getFocusTarget()).toBe(view2);
            expect(result).toHaveBeenCalledWith({
                next: view2,
                prev: view
            });
        });

        it('checks focus target', function() {
            var view;
            expect(this.vm.hasFocusTarget()).toBeFalsy();
            view = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            view.focus();
            expect(this.vm.hasFocusTarget()).toBeTruthy();
            view.blur();
            expect(this.vm.hasFocusTarget()).toBeFalsy();
        });

        it('returns focus target', function() {
            var view;
            expect(this.vm.getFocusTarget()).toBeNull();
            view = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            view.focus();
            expect(this.vm.getFocusTarget()).toBe(view);
            this.vm.setFocusTarget(null);
            expect(this.vm.getFocusTarget()).toBeNull();
        });

        it('sets at focus', function() {
            var aChilds, aChilds2, aParents, childs, childs2, i, negative, notCalled, parent, parents, positive, test, view, view2, _fn, _fn1, _fn2, _fn3, _fn4, _fn5, _fn6, _fn7, _fn8, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _len7, _len8, _len9, _m, _n, _o, _p, _q, _r, _ref, _ref1, _ref2, _ref3, _ref4, _results, _s, _t, _u;
            parents = 3;
            aParents = [];
            for (i = _i = 0; 0 <= parents ? _i < parents : _i > parents; i = 0 <= parents ? ++_i : --_i) {
                parent = (_ref = aParents[i - 1]) != null ? _ref : null;
                view = new View({
                    parent: parent,
                    tagName: 'div',
                    viewManager: this.vm
                });
                aParents.push(view);
            }
            childs = 5;
            aChilds = [];
            for (i = _j = 0; 0 <= childs ? _j < childs : _j > childs; i = 0 <= childs ? ++_j : --_j) {
                parent = (_ref1 = aChilds[i - 1]) != null ? _ref1 : aParents[aParents.length - 1];
                view = new View({
                    parent: parent,
                    tagName: 'div',
                    viewManager: this.vm
                });
                aChilds.push(view);
            }
            childs2 = 3;
            aChilds2 = [];
            for (i = _k = 0; 0 <= childs2 ? _k < childs2 : _k > childs2; i = 0 <= childs2 ? ++_k : --_k) {
                parent = (_ref2 = aChilds2[i - 1]) != null ? _ref2 : aParents[aParents.length - 1];
                view = new View({
                    parent: parent,
                    tagName: 'div',
                    viewManager: this.vm
                });
                aChilds2.push(view);
            }
            view = aChilds[aChilds.length - 1];
            view.focus();
            _ref3 = _flatten([aParents, aChilds]);
            _fn = function(test) {
                expect(test.isAtFocus()).toBeTruthy();
            };
            for (_l = 0, _len = _ref3.length; _l < _len; _l++) {
                test = _ref3[_l];
                _fn(test);
            }
            _fn1 = function(test) {
                expect(test.isAtFocus()).toBeFalsy();
            };
            for (_m = 0, _len1 = aChilds2.length; _m < _len1; _m++) {
                test = aChilds2[_m];
                _fn1(test);
            }
            notCalled = [];
            _fn2 = function(test) {
                spyOn(test, 'setAtFocus').and.callThrough();
                return notCalled.push(test.setAtFocus);
            };
            for (_n = 0, _len2 = aParents.length; _n < _len2; _n++) {
                test = aParents[_n];
                _fn2(test);
            }
            negative = [];
            _fn3 = function(test) {
                spyOn(test, 'setAtFocus').and.callThrough();
                return negative.push(test.setAtFocus);
            };
            for (_o = 0, _len3 = aChilds.length; _o < _len3; _o++) {
                test = aChilds[_o];
                _fn3(test);
            }
            positive = [];
            _fn4 = function(test) {
                spyOn(test, 'setAtFocus').and.callThrough();
                return positive.push(test.setAtFocus);
            };
            for (_p = 0, _len4 = aChilds2.length; _p < _len4; _p++) {
                test = aChilds2[_p];
                _fn4(test);
            }
            view2 = aChilds2[aChilds2.length - 1];
            view2.focus();
            _ref4 = _flatten([aParents, aChilds2]);
            _fn5 = function(test) {
                expect(test.isAtFocus()).toBeTruthy();
            };
            for (_q = 0, _len5 = _ref4.length; _q < _len5; _q++) {
                test = _ref4[_q];
                _fn5(test);
            }
            _fn6 = function(test) {
                expect(test.isAtFocus()).toBeFalsy();
            };
            for (_r = 0, _len6 = aChilds.length; _r < _len6; _r++) {
                test = aChilds[_r];
                _fn6(test);
            }
            _fn7 = function(test) {
                expect(test).not.toHaveBeenCalled();
            };
            for (_s = 0, _len7 = notCalled.length; _s < _len7; _s++) {
                test = notCalled[_s];
                _fn7(test);
            }
            _fn8 = function(test) {
                expect(test.calls.count()).toBe(1);
                expect(test).toHaveBeenCalledWith(false, false);
            };
            for (_t = 0, _len8 = negative.length; _t < _len8; _t++) {
                test = negative[_t];
                _fn8(test);
            }
            _results = [];
            for (_u = 0, _len9 = positive.length; _u < _len9; _u++) {
                test = positive[_u];
                _results.push((function(test) {
                    expect(test.calls.count()).toBe(1);
                    expect(test).toHaveBeenCalledWith(true, false);
                })(test));
            }
            return _results;
        });
    });

    describe('focus bound', function() {
        beforeEach(function() {
            var i, _i, _ref, _results;
            this.nav = VMHelpers.nav;
            this.counter = 10;
            this.views = [];
            _results = [];
            for (i = _i = 0, _ref = this.counter; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                _results.push(this.views.push(new View({
                    tagName: 'div',
                    viewManager: this.vm
                })));
            }
            return _results;
        });

        it('links views from top to bottom', function() {
            var index, view, _i, _len, _ref, _results;
            this.vm.topToBottom(this.views);
            _ref = this.views;
            _results = [];
            for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
                view = _ref[index];
                _results.push((function(_this) {
                    return function(view, index) {
                        expect(view[_this.nav].left).not.toBeDefined();
                        expect(view[_this.nav].right).not.toBeDefined();
                        if (index === 0) {
                            expect(view[_this.nav].up).not.toBeDefined();
                        } else {
                            expect(view[_this.nav].up).toBe(_this.views[index - 1]);
                        }
                        if (index === _this.counter - 1) {
                            expect(view[_this.nav].down).not.toBeDefined();
                        } else {
                            expect(view[_this.nav].down).toBe(_this.views[index + 1]);
                        }
                    };
                })(this)(view, index));
            }
            return _results;
        });

        it('links views from top to bottom with loop', function() {
            var index, view, _i, _len, _ref, _results;
            this.vm.topToBottom(this.views, true);
            _ref = this.views;
            _results = [];
            for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
                view = _ref[index];
                _results.push((function(_this) {
                    return function(view, index) {
                        expect(view[_this.nav].left).not.toBeDefined();
                        expect(view[_this.nav].right).not.toBeDefined();
                        if (index === 0) {
                            expect(view[_this.nav].up).toBe(_this.views[_this.counter - 1]);
                        } else {
                            expect(view[_this.nav].up).toBe(_this.views[index - 1]);
                        }
                        if (index === _this.counter - 1) {
                            expect(view[_this.nav].down).toBe(_this.views[0]);
                        } else {
                            expect(view[_this.nav].down).toBe(_this.views[index + 1]);
                        }
                    };
                })(this)(view, index));
            }
            return _results;
        });

        it('links views from left to right', function() {
            var index, view, _i, _len, _ref, _results;
            this.vm.leftToRight(this.views);
            _ref = this.views;
            _results = [];
            for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
                view = _ref[index];
                _results.push((function(_this) {
                    return function(view, index) {
                        expect(view[_this.nav].up).not.toBeDefined();
                        expect(view[_this.nav].down).not.toBeDefined();
                        if (index === 0) {
                            expect(view[_this.nav].left).not.toBeDefined();
                        } else {
                            expect(view[_this.nav].left).toBe(_this.views[index - 1]);
                        }
                        if (index === _this.counter - 1) {
                            expect(view[_this.nav].right).not.toBeDefined();
                        } else {
                            expect(view[_this.nav].right).toBe(_this.views[index + 1]);
                        }
                    };
                })(this)(view, index));
            }
            return _results;
        });

        it('links views from left to right with loop', function() {
            var index, view, _i, _len, _ref, _results;
            this.vm.leftToRight(this.views, true);
            _ref = this.views;
            _results = [];
            for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
                view = _ref[index];
                _results.push((function(_this) {
                    return function(view, index) {
                        expect(view[_this.nav].up).not.toBeDefined();
                        expect(view[_this.nav].down).not.toBeDefined();
                        if (index === 0) {
                            expect(view[_this.nav].left).toBe(_this.views[_this.counter - 1]);
                        } else {
                            expect(view[_this.nav].left).toBe(_this.views[index - 1]);
                        }
                        if (index === _this.counter - 1) {
                            expect(view[_this.nav].right).toBe(_this.views[0]);
                        } else {
                            expect(view[_this.nav].right).toBe(_this.views[index + 1]);
                        }
                    };
                })(this)(view, index));
            }
            return _results;
        });

        it('links views as grid', function() {
            var cols, getCol, getRow, index, rows, view, _i, _len, _ref, _results;
            cols = 2;
            getCol = function(index) {
                return index % cols;
            };
            getRow = function(index) {
                return Math.floor(index / cols);
            };
            rows = getRow(this.views.length - 1);
            this.vm.grid(this.views, cols);
            _ref = this.views;
            _results = [];
            for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
                view = _ref[index];
                _results.push((function(_this) {
                    return function(view, index) {
                        var col, row;
                        row = getRow(index);
                        col = getCol(index);
                        if (row === 0) {
                            expect(view[_this.nav].up).not.toBeDefined();
                        } else {
                            expect(view[_this.nav].up).toBe(_this.views[index - cols]);
                        }
                        if (row === rows) {
                            expect(view[_this.nav].down).not.toBeDefined();
                        } else {
                            expect(view[_this.nav].down).toBe(_this.views[index + cols]);
                        }
                        if (col === 0) {
                            expect(view[_this.nav].left).not.toBeDefined();
                        } else {
                            expect(view[_this.nav].left).toBe(_this.views[index - 1]);
                        }
                        if (col === cols - 1) {
                            expect(view[_this.nav].right).not.toBeDefined();
                        } else {
                            expect(view[_this.nav].right).toBe(_this.views[index + 1]);
                        }
                    };
                })(this)(view, index));
            }
            return _results;
        });
    });

    describe('focus move', function() {
        it('basic move', function() {
            var view, view2;
            view = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            view2 = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            this.vm.leftToRight([view, view2]);
            view.focus();
            this.vm.moveFocus(view, 'right');
            expect(this.vm.getFocusTarget()).toBe(view2);
            this.vm.moveFocus(view2, 'right');
            expect(this.vm.getFocusTarget()).toBe(view2);
            this.vm.moveFocus(view2, 'left');
            expect(this.vm.getFocusTarget()).toBe(view);
        });

        it('locks focus witin view', function() {
            var view, view2, view3, view4, view5;
            view = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            view2 = new View({
                tagName: 'div',
                parent: view,
                navKeys: 'down'
            });
            view3 = new View({
                tagName: 'div',
                parent: view2,
                navKeys: 'right'
            });
            view4 = new View({
                tagName: 'div',
                parent: view2,
                navKeys: 'left'
            });
            view5 = new View({
                tagName: 'div',
                parent: view,
                navKeys: 'up'
            });
            this.vm.leftToRight([view3, view4]);
            this.vm.topToBottom([view2, view5]);
            view.focus();
            expect(this.vm.getFocusTarget()).toBe(view3);
            this.vm._handleKeypress('right');
            expect(this.vm.getFocusTarget()).toBe(view4);
            this.vm._handleKeypress('down');
            expect(this.vm.getFocusTarget()).toBe(view5);
            this.vm._handleKeypress('up');
            expect(this.vm.getFocusTarget()).toBe(view4);
            this.vm.setFocusLocker(view2);
            this.vm._handleKeypress('down');
            expect(this.vm.getFocusTarget()).toBe(view4);
            this.vm._handleKeypress('left');
            expect(this.vm.getFocusTarget()).toBe(view3);
            this.vm.unsetFocusLocker();
            this.vm._handleKeypress('down');
            expect(this.vm.getFocusTarget()).toBe(view5);
            this.vm._handleKeypress('up');
            expect(this.vm.getFocusTarget()).toBe(view3);
            this.vm.setFocusLocker(view3);
            this.vm._handleKeypress('down');
            expect(this.vm.getFocusTarget()).toBe(view3);
            this.vm._handleKeypress('right');
            expect(this.vm.getFocusTarget()).toBe(view3);
        });

        it('jump disabled', function() {
            var view, view2, view3;
            view = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            view2 = new View({
                tagName: 'div',
                viewManager: this.vm,
                enabled: false
            });
            view3 = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            this.vm.leftToRight([view, view2, view3]);
            this.vm.moveFocus(view, 'right');
            expect(this.vm.getFocusTarget()).toBe(view3);
        });

        it('ask parent for focus move', function() {
            var view, view2, view3;
            view = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            view2 = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            view3 = new View({
                parent: view,
                tagName: 'div',
                viewManager: this.vm
            });
            this.vm.leftToRight([view, view2]);
            this.vm.moveFocus(view3, 'right');
            expect(this.vm.getFocusTarget()).toBe(view2);
        });

        it('triggers event on end reached', function() {
            var arg, callback, view, view2, view3;
            callback = jasmine.createSpy('callback');
            this.vm.on(VMEvents['VM_FOCUS_END'], callback);
            view = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            view.on(VMEvents['VM_FOCUS_END'], callback);
            view2 = new View({
                tagName: 'div',
                viewManager: this.vm
            });
            view2.on(VMEvents['VM_FOCUS_END'], callback);
            view3 = new View({
                parent: view,
                tagName: 'div',
                viewManager: this.vm
            });
            view3.on(VMEvents['VM_FOCUS_END'], callback);
            this.vm.leftToRight([view, view2]);
            this.vm.moveFocus(view3, 'right');
            expect(callback.calls.count()).toBe(0);
            this.vm.moveFocus(view3, 'left');
            arg = [
                {
                    view: view3,
                    dir: 'left'
                }
            ];
            expect(callback.calls.count()).toBe(3);
            expect(callback.calls.allArgs()).toEqual([arg, arg, arg]);
        });
    });

    it('locks keys', function() {
        var spy, view;
        spy = jasmine.createSpy('spy');
        view = new View({
            tagName: 'div',
            viewManager: this.vm
        });
        view.keyHandlers.add('up', spy);
        this.vm.lockKeys();
        view.focus(true);
        expect(view.isAtFocus()).toBeFalsy();
        view.focus();
        expect(view.isAtFocus()).toBeTruthy();
        this.vm._handleKeypress('up');
        expect(spy).not.toHaveBeenCalled();
        this.vm.unlockKeys();
        this.vm._handleKeypress('up');
        expect(spy).toHaveBeenCalled();
    });

    it('remove links to view', function() {
        var view, view2, view3;
        view = new View({
            tagName: 'div',
            viewManager: this.vm
        });
        view2 = new View({
            tagName: 'div',
            viewManager: this.vm
        });
        view3 = new View({
            tagName: 'div',
            viewManager: this.vm
        });
        this.vm.leftToRight([view, view2, view3]);
        view2.focus();
        this.vm.deleteView(view2);
        expect(this.vm.getFocusTarget()).toBeNull();
        expect(view[VMHelpers.nav].right).toBe(view3);
        expect(view3[VMHelpers.nav].left).toBe(view);
        expect(view2[VMHelpers.nav].left).toBeNull();
        expect(view2[VMHelpers.nav].right).toBeNull();
    });
});
