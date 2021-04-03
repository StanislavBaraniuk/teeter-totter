import invert from 'invert-color';
import genRandomColor from 'random-color'

export const randomColorHEX = () => genRandomColor()?.hexString();

export const invertHex = (hex) => invert(hex);