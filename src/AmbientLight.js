class AmbientLight {
    static programs = [];

    static addProgram = function(program) {
        AmbientLight.programs.push(program);
    }

    static getRGB = function() {
        let r = parseFloat(document.getElementById('ambientR').value);
        let g = parseFloat(document.getElementById('ambientG').value);
        let b = parseFloat(document.getElementById('ambientB').value);

        return {r, g, b};
    }

    static updateAmbientLightUniform = function() {
        let color = AmbientLight.getRGB();

        for (let i = 0; i < AmbientLight.programs.length; i++) {
            AmbientLight.programs[i].setUniform('ambientColor', 'uniform3f', color.r, color.g, color.b);
        }
    }
}

document.getElementById('ambientR').oninput = () => {
    AmbientLight.updateAmbientLightUniform();
}

document.getElementById('ambientG').oninput = () => {
    AmbientLight.updateAmbientLightUniform();
}

document.getElementById('ambientB').oninput = () => {
    AmbientLight.updateAmbientLightUniform();
}

export default AmbientLight;
