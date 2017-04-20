import { mat4, glMatrix } from 'gl-matrix';

class Camera {
    constructor(x, y, z) {
        this.pitch = 0;
        this.pitchRate = 0;
        this.yaw = 0;
        this.yawRate = 0;

        this.x = x;
        this.y = y;
        this.z = z;

        this.speed = 0;
        this.lastTime = 0;

        this.cameraMatrix = mat4.create();
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    setYawRate(yawRate) {
        this.yawRate = yawRate;
    }

    setPitchRate(pitchRate) {
        this.pitchRate = pitchRate;
    }

    animate() {
        let timeNow = new Date().getTime();

        if (this.lastTime != 0) {
            let elapsed = timeNow - this.lastTime;

            if (this.speed != 0) {
                this.x -= Math.sin(glMatrix.toRadian(this.yaw)) * this.speed * elapsed;
                this.z -= Math.cos(glMatrix.toRadian(this.yaw)) * this.speed * elapsed;
                this.y = this.y;
            }

            this.yaw += this.yawRate * elapsed;
            this.pitch += this.pitchRate * elapsed;
        }

        this.lastTime = timeNow;
    }

    updateCameraMatrix() {
        mat4.identity(this.cameraMatrix);
        mat4.rotate(this.cameraMatrix, this.cameraMatrix, glMatrix.toRadian(-this.pitch), [1, 0, 0]);
        mat4.rotate(this.cameraMatrix, this.cameraMatrix, glMatrix.toRadian(-this.yaw), [0, 1, 0]);
        mat4.translate(this.cameraMatrix, this.cameraMatrix, [-this.x, -this.y, -this.z]);
    }

    getCameraMatrix() {
        console.log(this.cameraMatrix);
        return this.cameraMatrix;
    }

    getCoords() {
        return {
            x: this.x,
            y: this.y,
            z: this.z
        }
    }
}

export default Camera;
