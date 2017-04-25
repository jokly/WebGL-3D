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

    getNextPosition() {
        let timeNow = new Date().getTime();
        let x = this.x, y = this.y, z = this.z;

        if (this.lastTime != 0) {
            let elapsed = timeNow - this.lastTime;

            if (this.speed != 0) {
                x -= Math.sin(glMatrix.toRadian(this.yaw)) * this.speed * elapsed;
                z -= Math.cos(glMatrix.toRadian(this.yaw)) * this.speed * elapsed;
                y = this.y;
            }
        }

        return {
            x: x,
            y: y,
            z: z
        }
    }

    updateCameraMatrix() {
        mat4.identity(this.cameraMatrix);
        mat4.rotate(this.cameraMatrix, this.cameraMatrix, glMatrix.toRadian(-this.pitch), [1, 0, 0]);
        mat4.rotate(this.cameraMatrix, this.cameraMatrix, glMatrix.toRadian(-this.yaw), [0, 1, 0]);
        mat4.translate(this.cameraMatrix, this.cameraMatrix, [-this.x, -this.y, -this.z]);
    }

    getCameraMatrix() {
        return this.cameraMatrix;
    }

    setPosition(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    getPosition() {
        return {
            x: this.x,
            y: this.y,
            z: this.z
        }
    }

    getSize() {
        return {
            x: 2,
            y: 2,
            z: 2
        };
    }
}

export default Camera;
