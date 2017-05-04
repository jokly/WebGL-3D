class Program {
    constructor(glContext) {
        this.gl = glContext;

        this.shaders = {
            vertex: null,
            fragment: null
        };

        this.glProgram = null;

        this.uniforms = {};
        this.lights = [];
    }

    setVertexShader(shaderId) {
        this.shaders.vertex = this.createShader(shaderId);

        if(this.shaders.fragment) {
            this.link();
        }
    }

    setFragmentShader(shaderId) {
        this.shaders.fragment = this.createShader(shaderId);

        if(this.shaders.vertex) {
            this.link();
        }
    }

    createShader(scriptId) {
        let script = document.getElementById(scriptId);

        if(!script) {
            return null;
        }

        let src = script.text;
        let type;

        if (script.type == 'x-shader/x-fragment') {
            type = this.gl.FRAGMENT_SHADER;
        } else if (script.type == 'x-shader/x-vertex') {
            type = this.gl.VERTEX_SHADER;
        } else {
            return null;
        }

        let shader = this.gl.createShader(type);

        this.gl.shaderSource(shader, src);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.log('Could not initialise shaders: ' + this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);

            return null;
        }

        return shader;
    }

    link() {
        if (!this.shaders.vertex || !this.shaders.fragment) {
            console.log('Cannot link program: missing shader');
            return;
        }

        this.glProgram = this.gl.createProgram();

        this.gl.attachShader(this.glProgram, this.shaders.vertex);
        this.gl.attachShader(this.glProgram, this.shaders.fragment);

        this.gl.linkProgram(this.glProgram);

        if (!this.gl.getProgramParameter(this.glProgram, this.gl.LINK_STATUS)) {
            console.log('Cannot link program:\n' + this.gl.getProgramInfoLog(this.glProgram));
            this.glProgram = null;
            return;
        }
    }

    setUniform(name, type, ...values) {
        if (this.uniforms[name]) {
            this.uniforms[name].value = [...values];
        }
        else {
            this.uniforms[name] = {
                location: this.gl.getUniformLocation(this.glProgram, name),
                value: [...values]
            };

            if (this.uniforms[name].location === -1) {
                console.log('Canggot get location for uniform ${name}');
            }
        }

        this.uniforms[name].type = type ? type : this.getUniformType(value);
    }

    getUniformType(value) {
        if (value instanceof Float32Array) {
            return 'uniformMatrix' + value.length + 'fv';
        } else if (value instanceof Int32Array) {
            return 'uniformMatrix' + value.length + 'iv';
        } else {
            return 'uniformMatrix1f';
        }
    }

    setLight(position, color, index = -1) {
        if (index === -1) {
            this.lights.push({
                posLoc: this.gl.getUniformLocation(this.glProgram, 'lights[' + this.lights.length +'].position'),
                pos: position,
                colorLoc: this.gl.getUniformLocation(this.glProgram, 'lights[' + this.lights.length +'].color'),
                color: color,
            });
        } else {
            this.lights[index] = {
                posLoc: this.lights[index].posLoc,
                pos: position,
                colorLoc: this.lights[index].colorLoc,
                color: color,
            }
        }

        return this.lights.length;
    }

    updateLights() {
        for (let i = 0; i < this.lights.length; i++) {
            this.gl.uniform3fv(this.lights[i].posLoc, this.lights[i].pos);
            this.gl.uniform3fv(this.lights[i].colorLoc, this.lights[i].color);
        }
    }

    updateUniforms() {
        for (let name in this.uniforms) {
            let uniform = this.uniforms[name];
            let method = this.gl[uniform.type];

            if (!method) {
                console.log('Cannot set uniform value, unknown type: ' + uniform.type);
            }

            if (uniform.type.includes('uniformMatrix')) {
                method.bind(this.gl)(uniform.location, false, uniform.value[0]);
            }
            else {
                let evalStr = 'method.bind(this.gl)(uniform.location';

                for (let val of uniform.value) {
                    evalStr += ', ' + val;
                }

                evalStr += ');'
                eval(evalStr);
            }
        }

        this.updateLights();
    }
}

export default Program;
