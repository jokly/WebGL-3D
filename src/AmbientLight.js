class AmbientLight {
    constructor(program) {
        this.program = program;
    }

    getRGB() {
        let r = parseFloat(document.getElementById('ambientR').value);
        let g = parseFloat(document.getElementById('ambientG').value);
        let b = parseFloat(document.getElementById('ambientB').value);

        return {r, g, b};
    }

    setRGB(r, g, b) {
        document.getElementById('ambientR').value = r;
        document.getElementById('ambientG').value = g;
        document.getElementById('ambientB').value = b;

        this.updateAmbientLightUniform();
    }

    updateAmbientLightUniform(){
        let color = this.getRGB();
        this.program.setUniform('ambientColor', 'uniform3f', color.r, color.g, color.b);
    }
}

export default AmbientLight;
