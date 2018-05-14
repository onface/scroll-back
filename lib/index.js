import extend from "safe-extend"
import Motion from "motion-logic"
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
Scroll.prototype.emitChange = function (mount, mode) {
    const self = this
    if (mode === 'none') {
        self.settings.onChange(mount)
        return
    }
    let padding = self.settings.padding(mount)
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
    self.settings.onChange(mount)
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
    let lastMove = self.data.relativeMove[self.data.relativeMove.length-1]
    let moveMount = value - self.data.start
    let mountValue = lastMove.value - moveMount
    self.data.relativeMove.push({
        value: moveMount,
        time: new Date().getTime()
    })
    self.emitChange(-mountValue)
}
Scroll.prototype.touchEnd = function (value) {
    const self = this
    self.data.start = null
    let beforeEndTime = getBeforeEndTime(self.data.relativeMove)
    let padding = self.settings.padding(0)
    let emitClose = function () {
        if (self.settings.onRelease(padding)) {
            self.close()
        }
    }
    if (Math.abs(beforeEndTime.mount) > 30) {
        let firstEndSpeed = Math.abs(beforeEndTime.speed) * 0.5
        let value = Math.abs(beforeEndTime.mount*4)
        let handleAction = function (mount) {
            if (beforeEndTime.mount > 0) {
                mount = -mount
            }
            self.emitChange(mount)
        }
        self.motion = new Motion({
            startSpeed: Math.abs(beforeEndTime.speed),
            endSpeed: firstEndSpeed,
            value: value,
            onAction: handleAction,
            onDone: function () {
                // hands off
                var padding = self.settings.padding(0)
                if (Math.max(padding.start, padding.end) > 0) {
                    emitClose()
                }
                else {
                    self.motion = new Motion({
                        startSpeed: firstEndSpeed,
                        endSpeed: 0,
                        value: value,
                        onAction: handleAction,
                        onDone: function () {
                            emitClose()
                        }
                    })
                    self.motion.run()
                }
            }
        })
        self.motion.run()
    }
    else {
        emitClose()
    }
    self.data.relativeMove = []
}
Scroll.prototype.close = function (closePadding = 0) {
    const self = this
    let padding = self.settings.padding(0)
    if (padding.start > 0) {
        self.motion = new Motion({
            value: Math.abs(padding.start) - closePadding,
            duration: 100,
            onAction: function (mount) {
                self.emitChange(-mount, 'none')
            }
        })
        self.motion.run()
    }
    if (padding.end > 0) {
        self.motion = new Motion({
            value: Math.abs(padding.end) - closePadding,
            duration: 100,
            onAction: function (mount) {
                self.emitChange(mount, 'none')
            }
        })
        self.motion.run()
    }
}
module.exports = Scroll
