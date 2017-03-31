import { vec3, mat4 } from 'gl-matrix';

class Geometry {
    constructor(glContext) {
        this.gl = glContext;

        this.attributes = {};
        this.itemsCount = null;
        this.indices = {};
        this.texture = null;

        this.translate = vec3.create();
        this.scale = vec3.fromValues(1, 1, 1);
}

    addAttribute(name, data, itemSize) {
        let attribute = {
            buffer: null,
            itemSize: itemSize,
            itemsCount: data.length / itemSize,
        };

        if (this.itemsCount !== null && attribute.itemsCount != this.itemsCount) {
            console.log('Geometry attributes with different items count');
        }
        else {
            this.itemsCount = attribute.itemsCount;
        }

        attribute.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attribute.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);

        this.attributes[name] = attribute;

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }

    setIndices(indices) {
        this.indices = {
            buffer: null,
            length: indices.length
        };

        this.indices.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    setTexture(texture) {
        this.texture = texture;
    }

    setTranslate(translate) {
        this.translate = translate;
    }

    getTranslate() {
        return this.translate;
    }

    setScale(scale) {
        this.scale = scale;
    }

    getTransformMatrix() {
        let outMat = mat4.create();
        mat4.translate(outMat, outMat, this.translate);
        mat4.scale(outMat, outMat, this.scale);

        return outMat;
    }

}

export default Geometry;