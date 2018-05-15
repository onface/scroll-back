import extend from "safe-extend"
import Motion from "face-motion"
import getBeforeEndTime from "./getBeforeEndTime"
class Scroll {
    constructor(props) {
        const self = this
        self.settings = extend.clone(props)
        self.data = {
            start: null,
            relativeMove:[]
        }
    }
}
Scroll.prototype.getPadding = function (mount) {
    const self = this
    let padding = self.settings.padding(mount)
    if (/e/.test(String(padding.end))) {
        padding.end = 0
    }
    padding.overflow = false
    if (Math.max(padding.start, padding.end) > 0) {
        padding.overflow = true
    }
    return padding
}
Scroll.prototype.emitChange = function (mount, mode) {
    const self = this
    let padding = self.getPadding(mount)
    if (mode === 'none') {
        self.settings.onChange(mount, padding)
        return
    }
    if (padding.start > 0) {
        mount = mount * self.settings.throttle(padding.start)
    }
    if (padding.end > 0) {
        mount = mount * self.settings.throttle(padding.end)
    }
    // hands off
    if (!self.data.start) {

        mount = mount * self.settings.throttle(Math.max(padding.start, padding.end))
    }
    self.settings.onChange(mount, padding)
}
Scroll.prototype.touchStart = function (value) {
    const self = this
    self.data.start = value
    self.data.relativeMove.push({
        value: 0,
        time: new Date().getTime()
    })
    if (typeof self.motion !== 'undefined') {
        self.motion.stop()
    }
}
Scroll.prototype.touchMove = function (value) {
    const self = this
    let mountValue = self.addData(value)
    self.emitChange(-mountValue)
}
Scroll.prototype.addData = function (value) {
    const self = this
    let lastMove = self.data.relativeMove[self.data.relativeMove.length-1]
    value = value || lastMove.value + self.data.start
    let moveMount = value - self.data.start
    self.data.relativeMove.push({
        value: moveMount,
        time: new Date().getTime()
    })
    let mountValue = lastMove.value - moveMount
    return mountValue
}
Scroll.prototype.touchEnd = function (value) {
    const self = this
    self.addData()
    let beforeEndTime = getBeforeEndTime(self.data.relativeMove)
    let padding = self.getPadding(0)
    let emitClose = function () {
        if (self.settings.onRelease(self.getPadding(0))) {
            self.close()
        }
    }
    if (Math.abs(beforeEndTime.mount) > 20 && !padding.overflow) {
        self.motion = new Motion({
            duration: 2000,
            startSpeed: beforeEndTime.speed,
            endSpeed: 0,
            onAction: function (mount, speed) {
                padding = self.getPadding(0)
                if (padding.overflow) {
                    self.motion.stop()
                    self.motion = new Motion({
                        startSpeed: speed,
                        endSpeed: 0,
                        duration: 100,
                        onAction: function (mount) {
                            if (beforeEndTime.mount < 0) {
                                mount = -mount
                            }
                            self.emitChange(-mount)
                        },
                        onDone: function () {
                            emitClose()
                        }
                    })
                }
                else {
                    if (beforeEndTime.mount < 0) {
                        mount = -mount
                    }
                    self.emitChange(-mount)
                }
            },
            onDone: function () {
                padding = self.getPadding(0)
                // overflow
                if (padding.overflow) {
                    emitClose()
                }
            }
        })
    }
    else {
        emitClose()
    }
    self.data.start = null
    self.data.relativeMove = []
}
Scroll.prototype.close = function (closePadding = 0, callback) {
    const self = this
    let padding = self.getPadding(0)
    if (padding.start > 0) {
        self.motion = new Motion({
            value: Math.abs(padding.start) - closePadding,
            duration: 500,
            onAction: function (mount) {
                self.emitChange(-mount, 'none')
            },
            onDone: callback
        })
    }
    if (padding.end > 0) {
        self.motion = new Motion({
            value: Math.abs(padding.end) - closePadding,
            duration: 500,
            onAction: function (mount) {
                self.emitChange(mount, 'none')
            },
            onDone: callback
        })
    }
}
module.exports = Scroll
