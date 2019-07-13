import React from 'react'
const css = require('./../css/pixel.css');

class Pixel extends React.Component {

    constructor (props) {
        super (props);
        this.state = {
            selected: false
        }

        this._buyPixel = this._buyPixel.bind(this);
    }

    _selectPixel () {
        let state = this.state;
        state.selected = !state.selected;
        this.setState(state);
    }

    _buyPixel() {
        this.props.pixelGridInstance.buyPixel(this.props.xPos, this.props.yPos, "#000000", { from: this.props.account, gas:3000000 }).then((result) =>
            console.log("pixel bought")
        )
    }

    render() {
        let selectedClass = "";
        if(this.state.selected) {
            selectedClass = "pixel_inner_outline"
        }

        return (
            <div
                onClick={this.props.selectPixel}
                className={"pixel " + selectedClass }
                style={
                    {backgroundColor: this.props.rgbColor}
                }/>
        )
    }
}

export default Pixel;
