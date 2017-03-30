class Program {
    constructor(glContext) {
        this.gl = glContext;

        this.shaders = {
            vertex: null,
            fragment: null
        };

        this.glProgram = null;

        this.uniforms = {};
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
            this.glProgram = null;
            console.log('Cannot link program:\n' + this.gl.getProgramInfoLog(this.glProgram));
            return;
        }
    }

    setUniform(name, value, type) {
        if (this.uniforms[name]) {
            this.uniforms[name].value = value;
        }
        else {
            this.uniforms[name] = {
                location: this.gl.getUniformLocation(this.glProgram, name),
                value: value
            };

            if (this.uniforms[name].location === -1) {
                console.log('Canggot get location for uniform ${name}');
            }
        }

        this.uniforms[name].type = type ? type : this.getUniformType(value);
    }

    getUniformType(value) {
        if (value instanceof WebGLTexture) {
            return 'texture';
        } else if (value instanceof Float32Array) {
            return value.length + 'fv';
        } else if (value instanceof Int32Array) {
            return value.length + 'iv';
        } else {
            return '1f';
        }
    }

    updateUniforms() {
        for (let name in this.uniforms) {
            let uniform = this.uniforms[name];
            let method = this.gl['uniformMatrix' + uniform.type];

            if (!method) {
                console.log('Cannot set uniform value, unknown type: ${uniform.type}');
            }

            method.bind(this.gl)(uniform.location, false, uniform.value);
        }
    }
}

export default Program;
