
Scene_Map.prototype.encounterEffectSpeed = function() {
    return 120; //2 seconds
};

Scene_Map.prototype.startEncounterEffect = function() {
    //this._spriteset.hideCharacters();
    this._encounterEffectDuration = this.encounterEffectSpeed();

    this._encounterEffectSprite = new Sprite(new Bitmap(480, 432));
    this.addChild(this._encounterEffectSprite);
};

Scene_Map.prototype.updateEncounterEffect = function() {
    if (this._encounterEffectDuration > 0) {
        this._encounterEffectDuration--;

        
        var speed = this.encounterEffectSpeed();
        var n = speed - this._encounterEffectDuration;
        var p = n / speed;
        var q = ((p - 1) * 20 * p + 5) * p + 1;
        //add and update sprite

        var framesLeft = this._encounterEffectDuration + 1
        var framesSoFar = this.encounterEffectSpeed() - framesLeft;

        //place dark squares
        var tx = 48 * ((framesSoFar-20) % 10); //target positions
        var ty = 48 * Math.floor((framesSoFar-20) / 10);
        this._encounterEffectSprite.bitmap.fillRect(tx,ty,48,48,"#000")

        //timing effects
        if (framesSoFar === 2) {
            //this.startFlashForEncounter(speed / 2);
            BattleManager.playBattleBgm();
            this.startFlashForEncounter(20);
        }
        if (framesSoFar === Math.floor(speed / 6)) {
            // this.startFlashForEncounter(speed / 2);
        }
        if (framesSoFar === Math.floor(speed / 2)) {
            BattleManager.playBattleBgm();
            // this.startFadeOut(this.fadeSpeed());
        }

    } else {
        //remove sprite
        //this._encounterEffectSprite = null;
    }
};