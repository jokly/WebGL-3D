import Shape from './Shape';

class Floor extends Shape {
    constructor(glContext, texture, {translate = [0, 0, 0], scale = [1, 1, 1],
        isCollided = false} = {}) {

        let vertices = [
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,
        ];
        vertices.itemSize = 3;

        let indices = [
            0, 1, 2,
            0, 2, 3
        ];

        let textureCoordinates = [
            0.0, 0.0,
            100.0, 0.0,
            100.0, 100.0,
            0.0, 100.0,
        ];
        textureCoordinates.itemSize = 2;

        let vertexNormals = [
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
        ];
        vertexNormals.itemSize = 3;

        super(glContext, vertices, indices, textureCoordinates, texture, vertexNormals,
            {translate, scale, isCollided});
    }
}

export default Floor;
