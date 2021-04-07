let maxSpeed: number | null = null;

// modern Chrome requires { passive: false } when adding event
const supportsPassive = (() => {
    let supportsPassive = false;
    try {
        window.addEventListener("test", null as any, Object.defineProperty({}, "passive", {
            get: function () { supportsPassive = true; }
        }));
    } catch (e) { }
    return supportsPassive;
})();

const wheelOpt = supportsPassive ? { passive: false } : false;
const wheelEvent = "onwheel" in document ? "wheel" : "mousewheel";

function easeInOutSine(x: number): number {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}

let startScrollTime: number | null = null;
let targetScrollTime: number | null = null;
let startScroll: number | null = null;
let targetScroll: number | null = null;
function animationFrame() {
    if (targetScroll == null) {
        return;
    }
    const perc = (Date.now() - startScrollTime!) / (targetScrollTime! - startScrollTime!);
    if (perc >= 1) {
        window.scrollTo(0, targetScroll);
        startScrollTime = null;
        targetScrollTime = null;
        startScroll = null;
        targetScroll = null;
        return;
    }
    window.scrollTo(
        0,
        ((targetScroll - startScroll!) * easeInOutSine(perc)) + startScroll!
    );
    requestAnimationFrame(animationFrame);
}
function customScroll(event) {
    event.preventDefault();
    
    const deltaY = event.deltaY * (event.deltaMode === 1 ? 40 : 1);
    const scrollParent = document.scrollingElement || document.firstElementChild || document.body;
    if (startScroll == null) {
        startScroll = scrollParent.scrollTop;
        startScrollTime = Date.now();
        targetScroll = startScroll;
        targetScrollTime = startScrollTime;
    }
    targetScroll = targetScroll! + deltaY;
    targetScrollTime = targetScrollTime! + (Math.abs(deltaY) / maxSpeed!);
    requestAnimationFrame(animationFrame);
}

// thanks to https://stackoverflow.com/a/4770179/9228492
const keys = {
    37: 0, // left
    38: -1, // up
    39: 0, // right
    40: 1, // down
    32: 1  // spacebar
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
    window.addEventListener(wheelEvent, customScroll, wheelOpt); // modern desktop
    window.addEventListener("keydown", preventDefaultForScrollKeys, false);
}
function removeEventListener() {
    window.removeEventListener(wheelEvent, customScroll, wheelOpt as any); // modern desktop
    window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
}

export default function setScrollMaxSpeed(limit: number | null): void {
    if (typeof limit !== "number" || isNaN(limit) || limit <= 0) {
        limit = null;
    } else {
        limit = Math.round(limit);
    }
    if (limit === maxSpeed) {
        return;
    }
    if (limit == null) {
        if (maxSpeed != null) {
            removeEventListener();
        }
    } else {
        if (maxSpeed == null) {
            addEventListener();
        }
    }
    maxSpeed = limit;
}