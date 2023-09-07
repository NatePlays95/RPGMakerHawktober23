
_23RepoBattlers_SpriteEnemy_setBattler = Sprite_Enemy.prototype.setBattler;
Sprite_Enemy.prototype.setBattler = function(battler) {
    _23RepoBattlers_SpriteEnemy_setBattler.call(this, battler);
    
    if (!this._enemy._movedScreenY) {
      //this._homeY += Math.floor((Graphics.boxHeight - 624) / 2);
      //this._homeY -= this._homeY%3;
      this._homeY = 240;
      this._enemy._screenY = this._homeY;
      this._enemy._movedScreenY = true;
    }

    if (!this._enemy._movedScreenX) {
      this._homeX += (Graphics.boxWidth - 816) / 2;
      this._homeX -= this._homeX%3 + 1;
      this._enemy._screenX = this._homeX;
      this._enemy._movedScreenX = true;
    }
};