import React from 'react'
import ReactDOM from 'react-dom'

const hasOverflow = el => el.clientHeight < el.scrollHeight

const isScrolledDown = (el, threshold) => {
    const bottom = el.scrollTop + el.clientHeight
    return bottom >= el.scrollHeight - threshold
}

const isScrolledTop = el => el.scrollTop === 0

const scrollDown = el => el.scrollTop = el.scrollHeight - el.clientHeight

export default (Component, { isScrolledDownThreshold = 150 } = { }) => class extends React.PureComponent {
    constructor(props){
        super(props)
        this._isScrolledDown = true /* whether the user has scrolled down */
        this._el = null
    }
    scrollDownIfNeeded(){
        if(this._isScrolledDown && hasOverflow(this._el)){
            scrollDown(this._el)
        }
    }
    handleScroll(e){
        this._isScrolledDown = isScrolledDown(this._el, isScrolledDownThreshold)
        if(isScrolledTop(this._el)){
            const fn = this.props.onScrolledTop
            fn && fn(e)
        }
    }
    componentDidMount(){ 
        this.scrollDownIfNeeded()
    }
    componentDidUpdate(){ 
        this.scrollDownIfNeeded()
    }
    render(){
        return <Component
            {...this.props}
            ref={ el => this._el = ReactDOM.findDOMNode(el) }
            onScroll={ e => this.handleScroll(e) }
        />
    }
}