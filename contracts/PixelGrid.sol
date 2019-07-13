pragma solidity ^0.5.7;

contract PixelGrid {

    struct Pixel {
        uint id;
        uint x;
        uint y;
        string rgbColor;
        address account;
        uint latestPrice;
    }

    uint public maxWidth = 50;
    uint public maxHeight = 50;

    uint public pixelsCount;

    mapping(uint => Pixel) public pixels;

    constructor() public {
    }

    event buyPixelEvent();

    function addPixel(uint _x, uint _y, string memory _rgbColor, address _address, uint _latestPrice) private {
        pixelsCount++;
        pixels[pixelsCount] = Pixel(
            pixelsCount, _x, _y, _rgbColor,
            _address,
            _latestPrice
        );
    }

    function buyPixel(uint _x, uint _y, string memory _rgbColor, address _address, uint _latestPrice) public {
        addPixel(_x, _y, _rgbColor, _address, _latestPrice);
        emit buyPixelEvent();
    }
}