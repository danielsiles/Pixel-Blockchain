import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import PixelGrid from '../../build/contracts/PixelGrid.json'
import Modal from 'react-modal'
import 'bootstrap/dist/css/bootstrap.css'
import Pixel from "./Pixel";
import ColorPickerModal from "./ColorPickerModal";
const css = require('./../css/app.css');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '0x0',
      pixels: [],
      hasVoted: false,
      loading: true,
      voting: false,
        selectedI: null,
        selectedJ: null,
        openColorPicker: false
    };


      if (typeof web3 !== 'undefined') {
          this.web3Provider = web3.currentProvider
      } else {
          this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
      }

      this.web3 = new Web3(this.web3Provider)

    // this.web3Provider = new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545')

    this.pixelGrid = TruffleContract(PixelGrid)
    this.pixelGrid.setProvider(this.web3Provider)

      this.selectPixel = this.selectPixel.bind(this)
      this.closeModal = this.closeModal.bind(this)
      this.watchEvents = this.watchEvents.bind(this)
      this.initPixels = this.initPixels.bind(this)
    // this.watchEvents = this.watchEvents.bind(this)
  }

  componentDidMount() {
      // console.log("aquii!!", this.web3.eth)
      // this.web3.eth.getCoinbase((err, account) => {
      //     console.log("aqio foi?");
      // });

    this.web3.eth.getCoinbase((err, account) => {
        console.log(account);
      let state = this.state;
      state.account = account;
      this.setState( state )
      this.pixelGrid.deployed().then((pixelGridInstance) => {
        this.pixelGridInstance = pixelGridInstance;
        this.watchEvents();

        this.initPixels();
      });
    });
  }

  initPixels() {
      this.pixelGridInstance.pixelsCount().then((pixelsCount) => {
          for (var i = 1; i <= pixelsCount; i++) {
              this.pixelGridInstance.pixels(i).then((pixel) => {
                  const pixels = [...this.state.pixels];
                  pixels.push({
                      id: pixel[0],
                      x: pixel[1],
                      y: pixel[2],
                      rgbColor: pixel[3],
                      address: pixel[4],
                      latestPrice: pixel[5],
                  });
                  this.setState({ pixels: pixels })
              });
          }
      });
  }

  watchEvents() {
    console.log("cheguei aqiii");
    this.pixelGridInstance.buyPixelEvent({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch((error, event) => {
        console.log("opaaaa, eventou!1")
      this.initPixels()
    })
  }

  // buyPixel(x, y, rgbColor) {
  //   // this.setState({ voting: true })
  //   this.pixelGridInstance.buyPixel(candidateId, { from: this.state.account }).then((result) =>
  //     this.setState({ hasVoted: true })
  //   )
  // }

  selectPixel(i, j) {
    let state = this.state;
    state.openColorPicker = true;
    state.selectedI = i;
    state.selectedJ = j;
    this.setState(state);
  }

  closeModal() {
    let state = this.state;
    state.openColorPicker = false;
    this.setState(state);
  }

  render() {
      let pixels = [];
      let pixelsRow = [];
      let maxWidth = 50;
      let maxHeight = 50;
      let pixelColor = '#efefef';
    for(let i = 0; i < maxWidth; i++) {

        for(let j = 0; j < maxHeight; j++) {
            this.state.pixels.map((pixel) => {
                if (pixel.x.c[0] === i && pixel.y.c[0] === j) {
                  pixelColor = pixel.rgbColor;
                }
            });
            pixels.push(<td><Pixel
                xPos={i}
                yPos={j}
                rgbColor={pixelColor}

                selectPixel={() => this.selectPixel(i, j)}
            /></td>);
            pixelColor = '#efefef';
        }
        pixelsRow.push(<tr>{pixels}</tr>);
        pixels = [];
    }

    return (
      <div className="app">
          <table className="pixelTable">
              {pixelsRow}
          </table>
          <ColorPickerModal
            open={this.state.openColorPicker}
            i={this.state.selectedI}
            j={this.state.selectedJ}
            pixelGridInstance={this.pixelGridInstance}
            account={this.state.account}
            closeModal={this.closeModal}
            web3={this.web3}
            pixels={this.state.pixels}
          />
      </div>
    )
  }
}

ReactDOM.render(
   <App />,
   document.querySelector('#root')
)
