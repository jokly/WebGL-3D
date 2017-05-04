class AmbientColor {
    static programs = [];

    static addProgram = function(program) {
        AmbientColor.programs.push(program);
    }

    static getRGB = function() {
        let r = parseFloat(document.getElementById('ambientR').value);
        let g = parseFloat(document.getElementById('ambientG').value);
        let b = parseFloat(document.getElementById('ambientB').value);

        return {r, g, b};
    }

    static updateAmbientColorUniform = function() {
        let color = AmbientColor.getRGB();

        for (let i = 0; i < AmbientColor.programs.length; i++) {
            AmbientColor.programs[i].setUniform('ambientColor', 'uniform3f', color.r, color.g, color.b);
        }
    }
}

document.getElementById('ambientR').oninput = () => {
    AmbientColor.updateAmbientColorUniform();
}

document.getElementById('ambientG').oninput = () => {
    AmbientColor.updateAmbientColorUniform();
}

document.getElementById('ambientB').oninput = () => {
    AmbientColor.updateAmbientColorUniform();
}

export default AmbientColor;
