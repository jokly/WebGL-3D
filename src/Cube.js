import Shape from './Shape';
import Plane from './Plane';

class Cube {
    constructor(glContext, texture, {translate = [0, 0, 0], scale = [1, 1, 1],
        isCollided = false} = {}) {

        let vertices = [], indices = [], textureCoordinates = [], vertexNormals = [];

        indices = [ 0, 1, 2, 0, 2, 3 ];

        textureCoordinates = [
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ];

        // FRONT
        vertices = [
            -1.0, -1.0,  1.0,
            1.0, -1.0,  1.0,
            1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0
        ];
        vertexNormals = [
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0
        ];
        let front = new Plane(glContext, vertices, indices, textureCoordinates,
            vertexNormals, texture, {translate, scale, isCollided});

        // BACK
        vertices = [
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0, -1.0, -1.0
        ];
        vertexNormals = [
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0
        ];
        let back = new Plane(glContext, vertices, indices, textureCoordinates,
            vertexNormals, texture, {translate, scale, isCollided});

        // TOP
        vertices = [
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
            1.0,  1.0,  1.0,
            1.0,  1.0, -1.0
        ];
        vertexNormals = [
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0
        ];
        let top = new Plane(glContext, vertices, indices, textureCoordinates,
            vertexNormals, texture, {translate, scale, isCollided});

        // BOTTOM
        vertices = [
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0
        ];
        vertexNormals = [
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0
        ];
        let bottom = new Plane(glContext, vertices, indices, textureCoordinates,
            vertexNormals, texture, {translate, scale, isCollided});

        // RIGHT
        vertices = [
            1.0, -1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0,  1.0,  1.0,
            1.0, -1.0,  1.0
        ];
        vertexNormals = [
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0
        ];
        let right = new Plane(glContext, vertices, indices, textureCoordinates,
            vertexNormals, texture, {translate, scale, isCollided});

        // LEFT
        vertices = [
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0
        ];
        vertexNormals = [
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0
        ];
        let left = new Plane(glContext, vertices, indices, textureCoordinates,
            vertexNormals, texture, {translate, scale, isCollided});

        this.planes = [front, back, top, bottom, right, left];

        // let vertices = [
        //     // Front face
        //     -1.0, -1.0,  1.0,
        //     1.0, -1.0,  1.0,
        //     1.0,  1.0,  1.0,
        //     -1.0,  1.0,  1.0,
        //     // Back face
        //     -1.0, -1.0, -1.0,
        //     -1.0,  1.0, -1.0,
        //     1.0,  1.0, -1.0,
        //     1.0, -1.0, -1.0,
        //     // Top face
        //     -1.0,  1.0, -1.0,
        //     -1.0,  1.0,  1.0,
        //     1.0,  1.0,  1.0,
        //     1.0,  1.0, -1.0,
        //     // Bottom face
        //     -1.0, -1.0, -1.0,
        //     1.0, -1.0, -1.0,
        //     1.0, -1.0,  1.0,
        //     -1.0, -1.0,  1.0,
        //     // Right face
        //     1.0, -1.0, -1.0,
        //     1.0,  1.0, -1.0,
        //     1.0,  1.0,  1.0,
        //     1.0, -1.0,  1.0,
        //     // Left face
        //     -1.0, -1.0, -1.0,
        //     -1.0, -1.0,  1.0,
        //     -1.0,  1.0,  1.0,
        //     -1.0,  1.0, -1.0,
        // ];
        // vertices.itemSize = 3;
        //
        // let indices = [
        //     0, 1, 2,      0, 2, 3,    // Front face
        //     4, 5, 6,      4, 6, 7,    // Back face
        //     8, 9, 10,     8, 10, 11,  // Top face
        //     12, 13, 14,   12, 14, 15, // Bottom face
        //     16, 17, 18,   16, 18, 19, // Right face
        //     20, 21, 22,   20, 22, 23  // Left face
        // ];
        //
        // let textureCoordinates = [
        //     // Front face
        //     0.0, 0.0,
        //     1.0, 0.0,
        //     1.0, 1.0,
        //     0.0, 1.0,
        //     // Back face
        //     1.0, 0.0,
        //     1.0, 1.0,
        //     0.0, 1.0,
        //     0.0, 0.0,
        //     // Top face
        //     0.0, 1.0,
        //     0.0, 0.0,
        //     1.0, 0.0,
        //     1.0, 1.0,
        //     // Bottom face
        //     1.0, 1.0,
        //     0.0, 1.0,
        //     0.0, 0.0,
        //     1.0, 0.0,
        //     // Right face
        //     1.0, 0.0,
        //     1.0, 1.0,
        //     0.0, 1.0,
        //     0.0, 0.0,
        //     // Left face
        //     0.0, 0.0,
        //     1.0, 0.0,
        //     1.0, 1.0,
        //     0.0, 1.0,
        // ];
        // textureCoordinates.itemSize = 2;
        //
        // let vertexNormals = [
        //     // Front face
        //      0.0,  0.0,  1.0,
        //      0.0,  0.0,  1.0,
        //      0.0,  0.0,  1.0,
        //      0.0,  0.0,  1.0,
        //     // Back face
        //      0.0,  0.0, -1.0,
        //      0.0,  0.0, -1.0,
        //      0.0,  0.0, -1.0,
        //      0.0,  0.0, -1.0,
        //     // Top face
        //      0.0,  1.0,  0.0,
        //      0.0,  1.0,  0.0,
        //      0.0,  1.0,  0.0,
        //      0.0,  1.0,  0.0,
        //     // Bottom face
        //      0.0, -1.0,  0.0,
        //      0.0, -1.0,  0.0,
        //      0.0, -1.0,  0.0,
        //      0.0, -1.0,  0.0,
        //     // Right face
        //      1.0,  0.0,  0.0,
        //      1.0,  0.0,  0.0,
        //      1.0,  0.0,  0.0,
        //      1.0,  0.0,  0.0,
        //     // Left face
        //     -1.0,  0.0,  0.0,
        //     -1.0,  0.0,  0.0,
        //     -1.0,  0.0,  0.0,
        //     -1.0,  0.0,  0.0,
        // ];
        // vertexNormals.itemSize = 3;
        //
        //
        // super(glContext, vertices, indices, textureCoordinates, texture, vertexNormals,
        //     {translate, scale, isCollided});
    }

    get geometry() {
        let geometries = [];
        for (let plane of this.planes) {
            geometries.push(plane.geometry);
        }

        return geometries;
    }
}

export default Cube;
