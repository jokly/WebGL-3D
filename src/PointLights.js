class PointLights {
    constructor(program) {
        this.program = program;
        this.pointLights = [];
    }

    setLight(position, color, index = -1) {
        if (index === -1) {
            this.pointLights.push({
                pos: position,
                color: color,
            });
            index = this.pointLights.length - 1;
        } else {
            this.pointLights[index] = {
                pos: position,
                color: color,
            };
        }

        this.program.setUniform('pointLights[' + index + '].position', 'uniform3f',
            this.pointLights[index].pos[0], this.pointLights[index].pos[1], this.pointLights[index].pos[2]);
        this.program.setUniform('pointLights[' + index + '].color', 'uniform3f',
            this.pointLights[index].color[0], this.pointLights[index].color[1], this.pointLights[index].color[2]);
        this.program.updateUniforms();

        return this.pointLights.length;
    }
}

export default PointLights;
