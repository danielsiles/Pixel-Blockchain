import React from 'react'
import Modal from 'react-modal'
const css = require('./../css/colorPickerModal.css');
import { SketchPicker } from 'react-color';

export default class ColorPickerModal extends React.Component {

    constructor (props) {
        super (props);
        this.state = {
            selectedColor: "#000000"
        };

        this.handleChangeComplete = this.handleChangeComplete.bind(this);
        this._buyPixel = this._buyPixel.bind(this);
    }

    handleChangeComplete(color) {
        let state = this.state;
        state.selectedColor = color.hex;
        this.setState(state);
    }

    _buyPixel() {

        let existingPixel;
        for(let i = 0; i < this.props.pixels.length; i++) {
            if (this.props.pixels[i].x.c[0] === this.props.i && this.props.pixels[i].y.c[0] === this.props.j) {
                existingPixel = this.props.pixels[i];
                // break;
            }
        }

        console.log("existing pixel", existingPixel);
        let address = "0x57BBD79e3E598f45b282162aC3434Ab16061eeD2";
        let latestPrice = 1;

        if(existingPixel !== undefined) {
            address = existingPixel.address;
            latestPrice = existingPixel.latestPrice.c[0] + 1;
        }

        console.log("PARA QUEM FOI O PAGAMENTO", address);
        console.log("QUANTO FOI O PAGAMENTO", latestPrice);

        this.props.web3.eth.sendTransaction({
            from: this.props.account,
            to: address.toString(),
            value: this.props.web3.toWei(latestPrice.toString(), 'ether')
        }, (err, transactionId) => {
            console.log("error!! ",err);
                if (err) {
                    reject(error);
                }
                else {
                    console.log("pixel bought antes");
                    return this.props.pixelGridInstance.buyPixel(
                        this.props.i,
                        this.props.j,
                        this.state.selectedColor,
                        this.props.account,
                        latestPrice,
                        {
                        from: this.props.account,
                        gas: 4500000
                    }).then((result) => {
                        console.log("pixel bought");
                        this.props.closeModal()
                    });
                }
            }
        )

        // return this.props.pixelGridInstance.buyPixel(this.props.i, this.props.j, this.state.selectedColor, {
        //     from: this.props.account,
        //     gas: 4500000
        // }).then((result) => {
        //     console.log("pixel bought")
        //     this.props.closeModal()
        // })
    }

    render() {
        return (
            <Modal
                isOpen={this.props.open}
                contentLabel="Example Modal"
                onRequestClose={() => this.props.closeModal()}
                style={{content: {maxWidth: 260, height: null}}}
            >
                <SketchPicker
                    color={this.state.selectedColor}
                    onChangeComplete={ this.handleChangeComplete }
                />
                <div className="buyButton" onClick={this._buyPixel}>
                    Comprar [{this.props.i} , {this.props.j}]
                </div>
                <div className="closeButton" onClick={() => this.props.closeModal()}>
                    Fechar
                </div>

            </Modal>
        )
    }
}
