(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.scrollSpeedLimit = factory());
}(this, (function () { 'use strict';

    var maxSpeed = null;
    var supportsPassive = (function () {
        var supportsPassive = false;
        try {
            window.addEventListener("test", null, Object.defineProperty({}, "passive", {
                get: function () { supportsPassive = true; }
            }));
        }
        catch (e) { }
        return supportsPassive;
    })();
    var wheelOpt = supportsPassive ? { passive: false } : false;
    var wheelEvent = "onwheel" in document ? "wheel" : "mousewheel";
    function easeInOutSine(x) {
        return -(Math.cos(Math.PI * x) - 1) / 2;
    }
    var startScrollTime = null;
    var targetScrollTime = null;
    var startScroll = null;
    var targetScroll = null;
    function animationFrame() {
        if (targetScroll == null) {
            return;
        }
        var perc = (Date.now() - startScrollTime) / (targetScrollTime - startScrollTime);
        if (perc >= 1) {
            window.scrollTo(0, targetScroll);
            startScrollTime = null;
            targetScrollTime = null;
            startScroll = null;
            targetScroll = null;
            return;
        }
        window.scrollTo(0, ((targetScroll - startScroll) * easeInOutSine(perc)) + startScroll);
        requestAnimationFrame(animationFrame);
    }
    function customScroll(event) {
        event.preventDefault();
        var deltaY = event.deltaY * (event.deltaMode === 1 ? 40 : 1);
        var scrollParent = (function (parent) { return parent === document.body ? document.scrollingElement : parent; })(event.target.offsetParent || document.body);
        if (startScroll == null) {
            startScroll = scrollParent.scrollTop;
            startScrollTime = Date.now();
            targetScroll = startScroll;
            targetScrollTime = startScrollTime;
        }
        targetScroll = targetScroll + deltaY;
        targetScrollTime = targetScrollTime + (Math.abs(deltaY) / maxSpeed);
        requestAnimationFrame(animationFrame);
    }
    var keys = {
        37: 0,
        38: -1,
        39: 0,
        40: 1,
        32: 1
    };
    function preventDefaultForScrollKeys(e) {
        if (Object.prototype.hasOwnProperty.call(keys, e.keyCode)) {
            var event = {
                deltaY: keys[e.keyCode] * (e.shiftKey ? -1 : 1),
                deltaMode: 1,
                preventDefault: e.preventDefault.bind(e),
                target: document.body
            };
            customScroll(event);
            return false;
        }
    }
    function addEventListener() {
        window.addEventListener(wheelEvent, customScroll, wheelOpt);
        window.addEventListener("keydown", preventDefaultForScrollKeys, false);
    }
    function removeEventListener() {
        window.removeEventListener(wheelEvent, customScroll, wheelOpt);
        window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
    }
    function setScrollMaxSpeed(limit) {
        if (typeof limit !== "number" || isNaN(limit) || limit <= 0) {
            limit = null;
        }
        else {
            limit = Math.round(limit);
        }
        if (limit === maxSpeed) {
            return;
        }
        if (limit == null) {
            if (maxSpeed != null) {
                removeEventListener();
            }
        }
        else {
            if (maxSpeed == null) {
                addEventListener();
            }
        }
        maxSpeed = limit;
    }

    return setScrollMaxSpeed;

})));
