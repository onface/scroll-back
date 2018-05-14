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
    let overflow = self.settings.overflow(mount)
    if (overflow.start.over) {
        mount = mount * overflow.throttle(overflow.start.distance)
    }
    if (overflow.end.over) {
        mount = mount * overflow.throttle(overflow.end.distance)
    }
    // hands off
    if (!self.data.start) {
        mount = mount / 2
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
    let overflow = self.settings.overflow(0)
    let emitClose = function () {
        if (self.settings.onRelease(overflow)) {
            self.close()
        }
    }
    if (Math.abs(beforeEndTime.mount) > 30) {
        self.motion = new Motion({
            effect: 'easeOutQuart',
            startSpeed: Math.abs(beforeEndTime.speed),
            endSpeed: Math.abs(beforeEndTime.speed)*0.1,
            value: Math.abs(beforeEndTime.mount*4),
            onAction: function (mount) {
                if (beforeEndTime.mount > 0) {
                    mount = -mount
                }
                self.emitChange(mount)
            },
            onDone: function () {
                emitClose()
            }
        })
        self.motion.run()
    }
    else {
        emitClose()
    }
    self.data.relativeMove = []
}
Scroll.prototype.close = function (padding = 0) {
    const self = this
    let overflow = self.settings.overflow(0)
    if (overflow.start.over) {
        self.motion = new Motion({
            value: Math.abs(overflow.start.distance) - padding,
            duration: 100,
            onAction: function (mount) {
                self.emitChange(-mount, 'none')
            }
        })
        self.motion.run()
    }
    if (overflow.end.over) {
        self.motion = new Motion({
            value: Math.abs(overflow.end.distance) - padding,
            duration: 100,
            onAction: function (mount) {
                self.emitChange(mount, 'none')
            }
        })
        self.motion.run()
    }
}
module.exports = Scroll
