import { mat3, mat4, glMatrix } from 'gl-matrix';

class Pipeline {
    constructor() {
        this.perspective = mat4.create();
        this.cameraMatrix = mat4.create();
        this.objectMatrix = mat4.create();

        this.objectProps = null;
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

    setObjectProps(props) {
        this.objectProps = props;
    }

    updateTransformMatrix(program) {
        let mMatrix = mat4.create();
        mat4.translate(mMatrix, mMatrix, this.objectProps.trans);
        mat4.scale(mMatrix, mMatrix, this.objectProps.scale);

        let vMatrix = mat4.create();
        mat4.copy(vMatrix, this.cameraMatrix);
        //mat4.invert(vMatrix, this.cameraMatrix);

        let pMatrix = mat4.create();
        mat4.copy(pMatrix, this.perspective);

        let nMatrix = mat3.create();
        mat3.normalFromMat4(nMatrix, nMatrix);
        // mat3.fromMat4(nMatrix, mvMatrix);
        // mat3.invert(nMatrix, nMatrix);
        // mat3.transpose(nMatrix, nMatrix);

        program.setUniform('mMatrix', 'uniformMatrix4fv', mMatrix);
        program.setUniform('vMatrix', 'uniformMatrix4fv', vMatrix);
        program.setUniform('pMatrix', 'uniformMatrix4fv', pMatrix);
        program.setUniform('nMatrix', 'uniformMatrix3fv', nMatrix);
    }
}

export default Pipeline;
