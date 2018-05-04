import extend from "safe-extend"
import Motion from "motion-logic"
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
Scroll.prototype.touchStart = function (value) {
    const self = this
    self.data.start = value
    self.data.relativeMove.push({
        value: 0,
        time: new Date().getTime()
    })
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
    self.settings.onChange(-mountValue)
}
Scroll.prototype.touchEnd = function (value) {
    const self = this
    self.data.start = null
    self.data.relativeMove = []
    let motion = new Motion({
        effect: 'easeOutQuart',
        startSpeed: 0.1,
        endSpeed: 0,
        value: 100,
        onAction: self.settings.onChange
    })
    motion.run()
}
module.exports = Scroll
