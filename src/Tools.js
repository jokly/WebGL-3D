export   function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
    } : null;
}

export function rgbToHex(r, g, b) {
    return "#" + componentToHex(r * 255 | 0) + componentToHex(g * 255 | 0) + componentToHex(b * 255 | 0);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
