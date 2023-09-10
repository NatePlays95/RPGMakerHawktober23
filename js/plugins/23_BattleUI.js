Window_ActorCommand.prototype.loadWindowskin = function() {
    this.windowskin = ImageManager.loadSystem('WindowBattleCommand');
}

Window_ActorCommand.prototype.windowWidth = function() {
    return 144;
};

Window_ActorCommand.prototype.windowYPos = function() {
    return 168;
};

_23BattleUI_WindowActorCommand_initialize = Window_ActorCommand.prototype.initialize;
Window_ActorCommand.prototype.initialize = function() {
    _23BattleUI_WindowActorCommand_initialize.call(this);
    this.y = 168;
};

Window_ActorCommand.prototype.refresh = function() {
    Window_Command.prototype.refresh.call(this);
    this.reposition();
};

Window_ActorCommand.prototype.reposition = function() {
    if (!this._actor) return;
    var size = 32*3;
    var partySize = $gameParty.battleMembers().length;
    this.x = 0.5 * (Graphics.boxWidth - partySize*size) + this._actor.index()*size - 24;
};

// Scene_Battle.prototype.startActorCommandSelection = function() {
//     var index = 
//     this._statusWindow.select(BattleManager.actor().index());
//     this._partyCommandWindow.close();
//     this._actorCommandWindow.setup(BattleManager.actor());
// };

//sprites tied to window position
_23BattleUI_Sprite_Actor_update = Sprite_Actor.prototype.update;
Sprite_Actor.prototype.update = function() {
    _23BattleUI_Sprite_Actor_update.call(this);
    if (this._actor){
        this.setActorHome(this._actor.index());
    }
    
};

Scene_Battle.prototype.updateWindowPositions = function() {
    
    this._statusWindow.reposition();
    this._actorWindow.reposition();
    this._actorWindow.x = this._statusWindow.x;

    if (!this._actorCommandWindow.active) {
        this._actorCommandWindow.y = Graphics.boxHeight;
    } else {
        this._actorCommandWindow.y = this._actorCommandWindow.windowYPos();
    }

    // var statusX = 0;
    // if (BattleManager.isInputting()) {
    //     statusX = this._partyCommandWindow.width;
    // } else {
    //     statusX = this._partyCommandWindow.width / 2;
    // }
    // if (this._statusWindow.x < statusX) {
    //     this._statusWindow.x += 16;
    //     if (this._statusWindow.x > statusX) {
    //         this._statusWindow.x = statusX;
    //     }
    // }
    // if (this._statusWindow.x > statusX) {
    //     this._statusWindow.x -= 16;
    //     if (this._statusWindow.x < statusX) {
    //         this._statusWindow.x = statusX;
    //     }
    // }
};

Scene_Battle.prototype.createStatusWindow = function() {
    this._statusWindow = new Window_BattleStatus();
    this._statusWindow.reserveFaceImages();
    this.addWindow(this._statusWindow);
};





// Window_BattleStatus.prototype.initialize = function() {
//     var width = this.windowWidth();
//     var height = this.windowHeight();
//     var x = Graphics.boxWidth - width;
//     var y = Graphics.boxHeight - height;
//     Window_Selectable.prototype.initialize.call(this, x, y, width, height);
//     this.refresh();
//     this.openness = 0;
// };

Window_BattleStatus.prototype.loadWindowskin = function() {
    this.windowskin = ImageManager.loadSystem('WindowBlack');
};

Window_BattleStatus.prototype.windowWidth = function() {  return Graphics.boxWidth; };

Window_BattleStatus.prototype.windowHeight = function() { return 144; }

Window_BattleStatus.prototype.standardPadding = function() { return 0; }

Window_BattleStatus.prototype.maxCols = function() { return this.maxItems(); };

Window_BattleStatus.prototype.maxItems = function() { return Math.min(5, $gameParty.battleMembers().length); };

Window_BattleStatus.prototype.maxPageRows = function() { return 1; };

Window_BattleStatus.prototype.numVisibleRows = function() { return 1; };

Window_BattleStatus.prototype.spacing = function() { return 0; };

Window_BattleStatus.prototype.itemHeight = function() { return this.windowHeight(); };

Window_BattleStatus.prototype.itemWidth = function() { return 32*3; };

//preload all faces. period.
Window_BattleStatus.prototype.reserveFaceImages = function() {
    $dataActors.forEach(function(dataActor) {
    // console.log(dataActor);
        if (!dataActor) return;
        ImageManager.reserveFace(dataActor.faceName);
    }, this);
};

Window_BattleStatus.prototype.refresh = function() {
    console.log(this.windowWidth());
    // this.createContents();
    //this.contents.clear();
    this.drawAllItems();
};

Window_BattleStatus.prototype.reposition = function() {
    var partySize = $gameParty.battleMembers().length
    this.x = 0.5 * (Graphics.boxWidth - partySize*32*3);
    this.width = partySize*32*3;
};

Window_BattleStatus.prototype.itemRect = function(index) {
    var rect = new Rectangle();
    var maxCols = this.maxCols();
    rect.width = this.itemWidth();
    rect.height = this.itemHeight();
    rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
    rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
    return rect;
};

Window_BattleStatus.prototype.drawItem = function(index) {
    
    var actor = $gameParty.battleMembers()[index];
    // console.log('draw actor index:', index, actor.name());
    // this.drawBasicArea(this.basicAreaRect(index), actor);
    this.drawPortraitArea(this.portraitAreaRect(index), actor);
    // this.drawGaugeArea(this.gaugeAreaRect(index), actor);
};

Window_BattleStatus.prototype.portraitAreaRect = function(index) {
    var rect = this.itemRect(index);
    // rect.y += 48;
    // rect.height = 32*3;
    // rect.width -= this.gaugeAreaWidth() + 15;
    return rect;
};

Window_BattleStatus.prototype.drawPortraitArea = function(rect, actor) {
    // this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, '#555');
    
    this.drawActorName(actor, rect.x + 0, rect.y, 150);
    this.drawHpGauge(actor, rect.x, rect.y + 24, rect.width, 24);

    this.drawActorFace(actor, rect.x, rect.y + rect.height - 32*3, 32*3, 32*3);
    this.drawActorIconsBottom(actor, rect.x, rect.y, rect.width, rect.height);
};

Window_BattleStatus.prototype.drawHpGauge = function(actor, x, y, width, height) {
    this.contents.fillRect(x, y, width, height, '#000'); //back

    var hpColor = '#dc4f2b'; var hpLossColor = '#104b65';
    var borderSize = 3; 
    var fullWidth = width - 2*borderSize;
    var actualWidth = Math.floor(fullWidth * actor.hpRate());
    actualWidth -= actualWidth%3;
    var actualHeight = height - 2*borderSize;
    
    this.contents.fillRect(x+borderSize, y+borderSize, fullWidth, actualHeight, hpLossColor); //hp bar
    this.contents.fillRect(x+borderSize, y+borderSize, actualWidth, actualHeight, hpColor); //hp bar

    this.changeSFont(10);
    this.drawText('BLD', x, y, 96, 'left');
    this.drawText(actor.hp, x+width - 96, y, 96, 'right');
    this.resetTextColor();
};

Window_BattleStatus.prototype.drawActorIconsBottom = function(actor, x, y, width, height) {
    // width = width || 144;
    var iconWidth = 24;
    var icons = actor.allIcons();//.slice(0, Math.floor(width / iconWidth));
    var iconsPerLine = width / iconWidth; //4
    
    var index = 0;
    for (var h = 0; h < icons.length/4; h++) {
        for (var i = 0; i < iconsPerLine; i++) {
            // this.drawIcon(icons[index], x + iconWidth*(index%iconsPerLine), y + height - iconWidth*Math.floor(index/iconsPerLine));
            this.drawIcon(icons[index], x + iconWidth*(index%4), y + height - iconWidth*(1 +  Math.floor(index/iconsPerLine)));
            index++;
        }
    }
    // console.log(actor.name(), icons, iconsPerLine);
};






//from YEP BattleCore, fix font centering bug
Window_EnemyVisualSelect.prototype.updateWindowPosition = function() {
    if (!this._battler) return;
    this.x = -1 * this.width / 2;
    this.y = -1 * this.height + this.standardPadding();
    this.x += this._battler.spritePosX();
    this.y += this._battler.spritePosY();
    this.x = this.x.clamp(this._minX, this._maxX);
    this.y = this.y.clamp(this._minY, this._maxY);
  
    this.x -= this.x%3;
    this.y -= this.y%3;
  };

Window_EnemyVisualSelect.prototype.updateWindowSize = function() {
    //var spriteWidth = this._battler.spriteWidth();
    var spriteWidth = 16*9;
    this.contents.fontSize = Yanfly.Param.BECEnemyFontSize;
    if (this._nameTextWidth === undefined) {
      this._nameTextWidth = this.textWidth(this._battler.name());
    }
    var textWidth = this._nameTextWidth;
    textWidth += this.textPadding() * 2;
    var width = Math.max(spriteWidth, textWidth) + this.standardPadding() * 2;
    width = Math.ceil(width);
    var height = this._battler.spriteHeight() + this.standardPadding() * 2;
    height = Math.ceil(height);
    height = Math.max(height, this.lineHeight() + this.standardPadding() * 2);
    if (width === this.width && height === this.height) return;
    this.width = width;
    this.height = height;
    this.createContents();
    this._requestRefresh = true;
    this.makeWindowBoundaries();
};