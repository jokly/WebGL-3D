import { vec3, mat4 } from 'gl-matrix';

class Geometry {
    constructor(glContext, isCollided = false) {
        this.gl = glContext;

        this.attributes = {};
        this.itemsCount = null;
        this.indices = {};
        this.texture = null;

        this.translate = vec3.create();
        this.scale = vec3.fromValues(1, 1, 1);

        this.isCollided = isCollided;
    }

    addAttribute(name, data, itemSize) {
        let attribute = {
            data: data,
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

    setTranslate(x, y, z) {
        this.translate = vec3.fromValues(x, y, z);
    }

    getTranslate() {
        return this.translate;
    }

    setScale(x, y, z) {
        this.scale = vec3.fromValues(x, y, z);
    }

    getScale() {
        return this.scale;
    }

    getTransformMatrix() {
        let outMat = mat4.create();
        mat4.translate(outMat, outMat, this.translate);
        mat4.scale(outMat, outMat, this.scale);

        return outMat;
    }

    canCollided() {
        return this.isCollided;
    }

    getMinVertex() {
        let vertices = this.attributes['vertexPosition'].data;
        let result = vec3.fromValues(Number.MAX_SAFE_INTEGER , Number.MAX_SAFE_INTEGER , Number.MAX_SAFE_INTEGER );

        for (let i = 0; i < vertices.length; i += 3) {
            let v = vec3.fromValues(vertices[i], vertices[i + 1], vertices[i + 2]);
            let mat = this.getTransformMatrix();
            let vec = vec3.create();
            vec3.transformMat4(vec, v, mat);
            result[0] = Math.min(result[0], vec[0]);
            result[1] = Math.min(result[1], vec[1]);
            result[2] = Math.min(result[2], vec[2]);
        }

        return {
            x: result[0],
            y: result[1],
            z: result[2]
        };
    }

    getMaxVertex() {
        let vertices = this.attributes['vertexPosition'].data;
        let result = vec3.fromValues(Number.MIN_SAFE_INTEGER , Number.MIN_SAFE_INTEGER , Number.MIN_SAFE_INTEGER );

        for (let i = 0; i < vertices.length; i += 3) {
            let v = vec3.fromValues(vertices[i], vertices[i + 1], vertices[i + 2]);
            let mat = this.getTransformMatrix();
            let vec = vec3.create();
            vec3.transformMat4(vec, v, mat);
            result[0] = Math.max(result[0], vec[0]);
            result[1] = Math.max(result[1], vec[1]);
            result[2] = Math.max(result[2], vec[2]);
        }

        return {
            x: result[0],
            y: result[1],
            z: result[2]
        };
    }
}

export default Geometry;
