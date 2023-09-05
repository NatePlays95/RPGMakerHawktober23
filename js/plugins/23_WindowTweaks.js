Window.prototype._refreshPauseSign = function() {
    var sx = 144;
    var sy = 96;
    var p = 24;
    this._windowPauseSignSprite.bitmap = this._windowskin;
    this._windowPauseSignSprite.anchor.x = 1;
    this._windowPauseSignSprite.anchor.y = 1;
    this._windowPauseSignSprite.move(this._width, this._height);
    this._windowPauseSignSprite.setFrame(sx, sy, p, p);
    this._windowPauseSignSprite.alpha = 0;
};



//yanfly cobre esses
// Window_Base.prototype.standardBackOpacity = function() {
//     return 255;
// };
// Window_Base.prototype.standardPadding = function() {
//     return 12;
// };

Window_Base.prototype.processDrawIcon = function(iconIndex, textState) {
    this.drawIcon(iconIndex, textState.x, textState.y);
    textState.x += 24;
};

Window_Base.prototype.drawItemName = function(item, x, y, width) {
    width = width || 312;
    if (item) {
        var iconBoxWidth = Window_Base._iconWidth + 4;
        this.resetTextColor();
        this.drawIcon(item.iconIndex, x, y);
        this.drawText(item.name, x + 24, y, width - 24);
    }
};

Window_Base.prototype.drawActorIcons = function(actor, x, y, width) {
    width = width || 144;
    var icons = actor.allIcons().slice(0, Math.floor(width / Window_Base._iconWidth));
    for (var i = 0; i < icons.length; i++) {
        this.drawIcon(icons[i], x + 24 * i, y);
    }
};

//CAUTION: WILL BREAK WITH MULTIPLE FONT SIZES IN ONE TEXT BOX.
Window_Base.prototype.calcTextHeight = function(textState, all) {
    if (this.contents.sfont) {
        var lastSFontSize = this.contents.sfont.bitmap.height
        return this.contents.sfont.bitmap.height;
    }

    var lastFontSize = this.contents.fontSize;
    var textHeight = 0;
    var lines = textState.text.slice(textState.index).split('\n');
    var maxLines = all ? lines.length : 1;

    for (var i = 0; i < maxLines; i++) {
        var maxFontSize = this.contents.fontSize;
        var regExp = /\x1b[\{\}]/g;
        for (;;) {
            var array = regExp.exec(lines[i]);
            if (array) {
                if (array[0] === '\x1b{') {
                    this.makeFontBigger();
                }
                if (array[0] === '\x1b}') {
                    this.makeFontSmaller();
                }
                if (maxFontSize < this.contents.fontSize) {
                    maxFontSize = this.contents.fontSize;
                }
            } else {
                break;
            }
        }
        textHeight += maxFontSize + 8;
    }
    this.contents.fontSize = lastFontSize;
    return textHeight;
};








Window_Selectable.prototype.spacing = function() {
    return 0;
};





//Aqui muda a windowskin da message window.
Window_Message.prototype.loadWindowskin = function() {
    this.windowskin = ImageManager.loadSystem('WindowMessage');
};

Window_Message.prototype.numVisibleRows = function() {
    return 4;
};



Window_Message.prototype.windowHeight = function() {
    console.log(this.lineHeight());
    return this.fittingHeight(this.numVisibleRows());
};

Window_Message.prototype.newLineX = function() {
    var result = $gameMessage.faceName() === '' ? this.textPadding() : (Window_Base._faceWidth + this.textPadding() );
    console.log(result);
    return result;
};

