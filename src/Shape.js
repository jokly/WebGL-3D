import Geometry from './Geometry';

class Shape {
    constructor(glContext, vertices, indices, textureCoordinates,
        texture, {translate = [0, 0, 0], scale = [1, 1, 1], isCollided = false} = {}) {

        this._geometry = new Geometry(glContext, isCollided);
        this._geometry.addAttribute('vertexPosition', new Float32Array(vertices), vertices.itemSize);
        this._geometry.setIndices(new Uint16Array(indices));
        this._geometry.addAttribute('textureCoord', new Float32Array(textureCoordinates), textureCoordinates.itemSize);
        this._geometry.setTexture(texture);
        this._geometry.setTranslate(translate[0], translate[1], translate[2]);
        this._geometry.setScale(scale[0], scale[1], scale[2]);
    }

    get geometry() {
        return this._geometry;
    }

    set translate(trans) {
        this._geometry.setTranslate(trans[0], trans[1], trans[2]);
    }

    set scale(scl) {
        this._geometry.setScale(scl[0], scl[1], scl[2]);
    }
}

export default Shape;
