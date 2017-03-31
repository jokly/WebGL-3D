class Texture {
    constructor(gl, src) {
        this.gl = gl;
        this.image = new Image();
        this.image.gl = gl;
        this.image.texture = this.gl.createTexture();
        this.image.onload = this.handleLoadedTexture;
        this.image.src = src;
    }

    handleLoadedTexture() {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA,
            this.gl.UNSIGNED_BYTE, this);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }
}

export default Texture;