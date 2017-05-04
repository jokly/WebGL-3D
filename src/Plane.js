import Shape from './Shape';

class Plane extends Shape {
    constructor(glContext, vertices, indices, textureCoordinates, vertexNormals,
        texture, {translate = [0, 0, 0], scale = [1, 1, 1], isCollided = false} = {}) {

        super(glContext, vertices, indices, textureCoordinates, texture, vertexNormals,
            {translate, scale, isCollided});

    }
}

export default Plane;
