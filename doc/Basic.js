var React = require('react')
var Scroll = require('face-scroll')
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
                // if (overflow.start.distance < -30) {
                //     self.scroll.close(30)
                //     setTimeout(function () {
                //         self.scroll.close()
                //     }, 1000)
                //     return false
                // }
                return true
            },
            padding: function (mount) {
                return {
                    start: self.state.offsetY,
                    end: self.refsScroll.offsetHeight - self.refsContent.offsetHeight - self.state.offsetY
                }
            },
            throttle: function (padding) {
                var ratioOfPaddingToScroll = padding / self.refsScroll.offsetHeight
                var min = 0.1
                var max = 0.4
                var diff = max - min
                ratioOfPaddingToScroll = 1 - ratioOfPaddingToScroll
                return min + (ratioOfPaddingToScroll * diff)
            },
            onChange: function (mount) {
                var offsetY = self.state.offsetY + mount
                if (/e/.test(String(offsetY))) {
                    offsetY = 0
                }
                self.setState({
                    offsetY: offsetY
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
                    style={{border: '1px solid blue', height:'20em'}}
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
                        <div >
                            <h1>h1</h1>
                            <div style={{height: '150em', borderLeft: '11px dotted orange'}}></div>
                            <h3>h3</h3>
                        </div>
                        ...
                    </div>
                </div>
            </div>
        )
    }
}
/*ONFACE-DEL*/Basic = require("react-hot-loader").hot(module)(Basic)
module.exports = Basic
