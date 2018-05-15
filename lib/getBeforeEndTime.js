import extend from "safe-extend"
function getBeforeEndTime(data) {
    let duration = 0.2 * 1000
    data = extend.clone(data)
    data.reverse()
    let firstTime = data[0].time
    let output = []
    data.some(function (item) {
        output.unshift(item)
        if (firstTime - item.time > duration) {
            return true
        }
    })
    let mount = output[0].value - output[output.length-1].value
    return {
        mount: mount,
        speed: Math.abs(mount / duration),
        data: output
    }
}
module.exports = getBeforeEndTime
