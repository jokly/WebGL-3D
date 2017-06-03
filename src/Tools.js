export   function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 100,
        g: parseInt(result[2], 16) / 100,
        b: parseInt(result[3], 16) / 100,
    } : null;
}

export function rgbToHex(r, g, b) {
    return "#" + componentToHex(r * 100) + componentToHex(g * 100) + componentToHex(b * 100);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
