class Renderer {
    constructor(glContext, viewportWidth, viewportHeight) {
        this.gl = glContext;

        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;

        this.program = null;
        this.pipeline = null;
        this.camera = null;

        this.attributesLocations = {};
        this.geometries = [];

        this.init();
    }

    init() {
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clearColor(0.0, 153.0, 255.0, 1.0);
    }

    setProgram(program) {
        this.program = program;
    }

    setPipeline(pipeline) {
        this.pipeline = pipeline;
    }

    setCamera(camera) {
        this.camera = camera;
    }

    initAttributes(geometry) {
        for (name in geometry.attributes) {
            this.attributesLocations[name] = this.gl.getAttribLocation(this.program.glProgram, name);

            if (this.attributesLocations[name] === -1) {
                delete this.attributesLocations[name];
                console.log('Cannot find attribute location: ' + name);
            }

            this.gl.enableVertexAttribArray(this.attributesLocations[name]);
        }
    }

    setViewport(viewportWidth, viewportHeight) {
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
    }

    addGeometry(geometry) {
        this.geometries.push(geometry);
    }

    getGeometries() {
        return this.geometries;
    }

    render() {
        if (this.geometries.length === 0) {
            console.log('Cannot render: no geometry specified');
        }

        if (!this.program) {
            console.log('Cannot render: no program specified');
        }

        if (!this.program.glProgram) {
            console.log('Cannot render: invalid program');
        }

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, this.viewportWidth, this.viewportHeight);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.gl.useProgram(this.program.glProgram);

        for (let geometry of this.geometries) {
            this.initAttributes(geometry);

            this.pipeline.setObjectMatrix(geometry.getTransformMatrix());
            this.pipeline.setCameraMatrix(this.camera.getCameraMatrix());
            this.pipeline.updateTransformMatrix(this.program);

            this.program.updateUniforms();

            for (let name in geometry.attributes) {
                let attribute = geometry.attributes[name];

                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attribute.buffer);
                this.gl.vertexAttribPointer(this.attributesLocations[name], attribute.itemSize, this.gl.FLOAT, false, 0, 0);
            }

            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, geometry.texture.image.texture);

            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, geometry.indices.buffer);

            this.gl.drawElements(this.gl.TRIANGLE_STRIP, geometry.indices.length, this.gl.UNSIGNED_SHORT, 0);
        }
    }
}

export default Renderer;
