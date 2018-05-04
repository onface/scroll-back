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
            scroll: self.refScroll.offsetHeight,
            content: self.refContent.offsetHeight,
            onChange: function (mount) {
                self.setState({
                    offsetY: self.state.offsetY + mount
                })
            }
        })
        self.refScroll.addEventListener('touchstart', function (e) {
            e.preventDefault()
            e.stopPropagation()
            self.scroll.touchStart(e.touches[0].clientY)
        })
        self.refScroll.addEventListener('touchmove', function (e) {
            e.preventDefault()
            e.stopPropagation()
            self.scroll.touchMove(e.touches[0].clientY)
        })
        self.refScroll.addEventListener('touchend', function (e) {
            e.preventDefault()
            e.stopPropagation()
            self.scroll.touchEnd()
        })
    }
    render () {
        const self = this
        return (
            <div className="basicDemo" >
                <div className="scroll" ref={(node) => {self.refScroll = node}}>
                    <div
                        className="content"
                        ref={(node) => {self.refContent = node}}
                        style={{
                            transform: `translateX(0px) translateY(${self.state.offsetY}px) translateZ(0px)`
                        }}
                     >
                         {self.state.offsetY}
                        ...
                        <div style={{height: '10em', border: '1px solid red'}} ></div>
                        ...
                    </div>
                </div>
            </div>
        )
    }
}
/*ONFACE-DEL*/Basic = require("react-hot-loader").hot(module)(Basic)
module.exports = Basic
