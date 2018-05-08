var React = require('react')
var Scroll = require('scroll')
class Basic extends React.Component {
    constructor(props) {
        super(props)
        const self = this
        self.state = {
            offsetY: 0
        }
    }
    componentDidMount() {
        const self = this
        self.scroll = new Scroll({
            onRelease: function (overflow) {
                return true
            },
            overflow: function (mount) {
                return {
                    start: {
                        over: Boolean(self.state.offsetY + mount > 0),
                        distance: -self.state.offsetY
                    },
                    end: {
                        over: Boolean(self.state.offsetY + mount < (self.refsScroll.offsetHeight - self.refsContent.offsetHeight)),
                        distance: (self.refsScroll.offsetHeight - self.refsContent.offsetHeight) - self.state.offsetY
                    },
                    throttle: function (distance) {
                        let min = 0.3
                        let retard = 1 - (Math.abs(distance / self.refsScroll.offsetHeight) + min)

                        console.log(retard)
                        return retard
                    }
                }
            },
            onChange: function (mount) {
                self.setState({
                    offsetY: self.state.offsetY + mount
                })
            }
        })
        self.refsScroll.addEventListener('touchstart', function (e) {
            e.preventDefault()
            e.stopPropagation()
            self.scroll.touchStart(e.touches[0].clientY)
        })
        self.refsScroll.addEventListener('touchmove', function (e) {
            e.preventDefault()
            e.stopPropagation()
            self.scroll.touchMove(e.touches[0].clientY)
        })
        self.refsScroll.addEventListener('touchend', function (e) {
            e.preventDefault()
            e.stopPropagation()
            self.scroll.touchEnd()
        })
    }
    render () {
        const self = this
        return (
            <div className="basicDemo" >
                <div className="scroll" ref={(node) => {self.refsScroll = node}}
                    style={{border: '1px solid blue', height:'10em'}}
                >
                    <div
                        className="content"
                        ref={(node) => {self.refsContent = node}}
                        style={{
                            transform: `translateX(0px) translateY(${self.state.offsetY}px) translateZ(0px)`,
                            border: '1px solid orange'
                        }}
                     >
                         {self.state.offsetY}
                        ...
                        <div style={{height: '24em', borderLeft: '1px solid red'}} ></div>
                        ...
                    </div>
                </div>
            </div>
        )
    }
}
/*ONFACE-DEL*/Basic = require("react-hot-loader").hot(module)(Basic)
module.exports = Basic
