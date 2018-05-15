var React = require('react')
var Scroll = require('face-scroll')
class Basic extends React.Component {
    constructor(props) {
        super(props)
        const self = this
        self.state = {
            offsetY: 0,
            padding: {
                start:null,
                end: null,
            }
        }
    }
    componentDidMount() {
        const self = this
        self.scroll = new Scroll({
            onRelease: function (padding) {
                return true
            },
            padding: function (mount) {
                return {
                    start: self.state.offsetY + mount,
                    end: (self.$refs.scroll.getBoundingClientRect().bottom - self.$refs.scroll.getBoundingClientRect().top) - (self.$refs.content.getBoundingClientRect().bottom - self.$refs.content.getBoundingClientRect().top) - self.state.offsetY + mount
                }
            },
            throttle: function (padding) {
                var ratioOfPaddingToScroll = padding / self.$refs.scroll.offsetHeight
                var min = 0.1
                var max = 0.4
                var diff = max - min
                ratioOfPaddingToScroll = 1 - ratioOfPaddingToScroll
                return min + (ratioOfPaddingToScroll * diff)
            },
            onChange: function (mount, padding) {
                var offsetY = self.state.offsetY + mount
                if (/e/.test(String(offsetY))) {
                    offsetY = 0
                }
                self.setState({
                    offsetY: offsetY,
                    padding: padding
                })
            }
        })
        self.$refs.scroll.addEventListener('touchstart', function (e) {
            e.preventDefault()
            e.stopPropagation()
            self.scroll.touchStart(e.touches[0].clientY)
        })
        self.$refs.scroll.addEventListener('touchmove', function (e) {
            e.preventDefault()
            e.stopPropagation()
            self.scroll.touchMove(e.touches[0].clientY)
        })
        self.$refs.scroll.addEventListener('touchend', function (e) {
            e.preventDefault()
            e.stopPropagation()
            self.scroll.touchEnd()
        })
    }
    render () {
        const self = this
        return (
            <div className="basicDemo" >
                <pre>{JSON.stringify(self.state.padding,null, 4)}</pre>
                <div className="scroll" ref={(node) => {self.$refs = self.$refs || {};self.$refs.scroll = node}}
                    style={{background: 'skyblue', height:'20em', overflow: 'hidden'}}
                >
                    <div
                        className="content"
                        ref={(node) => {self.$refs = self.$refs || {};self.$refs.content = node}}
                        style={{
                            transform: `translateX(0px) translateY(${self.state.offsetY}px) translateZ(0px)`,
                            background: 'orange'
                        }}
                     >
                         {self.state.offsetY}
                        <div >
                            <h1>start</h1>
                            <img src="https://picsum.photos/100/2000" alt=""/>
                            <h3>end</h3>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
/*ONFACE-DEL*/Basic = require("react-hot-loader").hot(module)(Basic)
module.exports = Basic
