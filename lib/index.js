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
Scroll.prototype.emitChange = function (mount, unhindered) {
    const self = this
    if (unhindered) {
        self.settings.onChange(mount)
        return
    }
    let start = self.settings.judgeStart(mount)
    if (start.isStart) {
        // self.settings.onChange(start.shouldMount)
        // return
        let retard = 1 - (Math.abs(start.retard()) + 0.3)
        if (retard < 0.1) {
            retard = 0.1
        }
        mount = mount * retard
    }
    let end = self.settings.judgeEnd(mount)
    if (end.isEnd) {
        self.settings.onChange(end.shouldMount)
        return
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
    let start = self.settings.judgeStart(0)
    let emitCloseStart = function () {
        if (!self.settings.onReleaseStart()) {
            self.closeStart()
        }
    }
    if (Math.abs(beforeEndTime.mount) > 10 && ! start.isStart) {
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
                emitCloseStart()
            }
        })
        self.motion.run()
    }
    else {
        emitCloseStart()
    }
    self.data.relativeMove = []
}
Scroll.prototype.closeStart = function (padding = 0) {
    const self = this
    let start = self.settings.judgeStart(0)
    if (start.isStart) {
        self.motion = new Motion({
            value: Math.abs(start.shouldMount) - padding,
            duration: 100,
            onAction: function (mount) {
                self.emitChange(-mount, true)
            }
        })
        self.motion.run()
    }
}
module.exports = Scroll
