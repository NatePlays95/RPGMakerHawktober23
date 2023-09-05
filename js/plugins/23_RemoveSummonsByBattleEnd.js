
var _23RSBBE_AllPossibleSummons = [8,9,10,11,12,13,14,15,16,17,18,19,20];

var _23RSBBE_gameParty_removeAllSummons = function() {
    _23RSBBE_AllPossibleSummons.forEach((id) => {
        $gameParty.removeActor(id);
    });
};

var _23RSBBE_BattleManager_endBattle = BattleManager.endBattle;
BattleManager.endBattle = function(result) {
    _23RSBBE_gameParty_removeAllSummons();
    _23RSBBE_BattleManager_endBattle.call(this, result);
};