//this game has a 3:1 pixel ratio, so we need to change that accordingly

//Graphics._stretchEnabled is now "Pixel-Perfect mode"

Graphics._updateRealScale = function() {
    if (this._stretchEnabled) { //fill the window
        var h = window.innerWidth / this._width;
        var v = window.innerHeight / this._height;
        if (h >= 1 && h - 0.01 <= 1) h = 1;
        if (v >= 1 && v - 0.01 <= 1) v = 1;
        this._realScale = Math.min(h, v);
    } else { //do pixel perfect scaling, 3:1
        var third = 1.0/3.0;

        var h = window.innerWidth / this._width;
        var v = window.innerHeight / this._height;
        this._realScale = Math.min(h, v);
        
        // if (this._realScale < 2*third) this._realScale = third;
        // else if (this._realScale < 1) this._realScale = 2*third;
        // else if (this._realScale < 4*third) this._realScale = 1;
        // else if (this._realScale < 5*third) this._realScale = 4*third;
        // else if (this._realScale < 6*third) this._realScale = 5*third;

        for (let i = 7; i > 0; i--) {
            if (this._realScale >= i*third) {
                this._realScale = i*third;
                break;
            } 
            if (i === 1) {
                this._realScale = third;
            }
        }
    }
  };



/**
 * @static
 * @method _createRenderer
 * @private
 */
Graphics._createRenderer = function() {
    PIXI.dontSayHello = true;
    var width = this._width;
    var height = this._height;
    var options = { view: this._canvas, resolution:1.0/3.0, roundPixels:true };
    try {
        switch (this._rendererType) {
        case 'canvas':
            this._renderer = new PIXI.CanvasRenderer(width, height, options);
            break;
        case 'webgl':
            this._renderer = new PIXI.WebGLRenderer(width, height, options);
            break;
        default:
            this._renderer = PIXI.autoDetectRenderer(width, height, options);
            break;
        }

        if(this._renderer && this._renderer.textureGC)
            this._renderer.textureGC.maxIdle = 1;

    } catch (e) {
        this._renderer = null;
    }
};

/**
 * @method _maskWindow
 * @param {Window} window
 * @private
 */
WindowLayer.prototype._maskWindow = function(window, shift) {
    //pass
    let resolution = Graphics._renderer.resolution;
    this._windowMask._currentBounds = null;
    this._windowMask.boundsDirty = true;
    var rect = this._windowRect;
    rect.x = this.x + shift.x + window.x;
    rect.y = this.x + shift.y + window.y + window.height / 2 * (1 - window._openness / 255);
    rect.width = window.width;
    rect.height = window.height * window._openness / 255;
    //nate addon
    rect.x /= resolution; rect.y /= resolution;
    rect.width /= resolution; rect.height /= resolution;
};