import { mat4, glMatrix } from 'gl-matrix';

class Pipeline {
    constructor() {
        this.perspective = mat4.create();
        this.cameraMatrix = mat4.create();
        this.objectMatrix = mat4.create();
    }

    setPerspective(viewportWidth, viewportHeight) {
        mat4.perspective(this.perspective, glMatrix.toRadian(45),
            viewportWidth / viewportHeight, 0.1, 100.0);
    }

    setCameraMatrix(cameraMatrix) {
        this.cameraMatrix = cameraMatrix;
    }

    setObjectMatrix(objectMatrix) {
        this.objectMatrix = objectMatrix;
    }

    updateTransformMatrix(program) {
        let gWorld = mat4.create();

        mat4.mul(gWorld, this.perspective, this.cameraMatrix);
        mat4.mul(gWorld, gWorld, this.objectMatrix);

        program.setUniform('gWorld', gWorld, '4fv');
    }
}

export default Pipeline;