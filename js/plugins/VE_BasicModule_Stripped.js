/*
 * ==============================================================================
 * ** Victor Engine MV - Basic Module
 * ------------------------------------------------------------------------------
 *  VE_BasicModule_Stripped.js
 * ==============================================================================
 */

var Imported = Imported || {};
Imported['VE - Basic Module'] = '1.23';

var VictorEngine = VictorEngine || {};
VictorEngine.BasicModule = VictorEngine.BasicModule || {};

(function() {

    VictorEngine.BasicModule.loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function() {
        VictorEngine.BasicModule.loadDatabase.call(this);
        PluginManager.requiredPlugin.call(PluginManager, 'VE - Basic Module');
    };

    PluginManager.requiredPlugin = function(name, required, version) {
        VictorEngine.BasicModule.checkPlugins(name, required, version);
    };

})();

/*:
 * ==============================================================================
 * @plugindesc v1.23 - Plugin with base code required for all Victor Engine plugins.
 * @author Victor Sant
 *
 *
 * ==============================================================================
 * @help 
 * ==============================================================================
 * Install this plugin above any other Victor Engine plugin.
 * ==============================================================================
 * 
 * ==============================================================================
 *  Version History:
 * ------------------------------------------------------------------------------
 *  v 1.00 - 2015.11.26 > First release.
 *  v 1.01 - 2015.11.29 > Added function to get database objects.
 *  v 1.02 - 2015.12.07 > Added function to get multiples elements.
 *                      > Added check for plugin correct order.
 *  v 1.03 - 2015.12.13 > Added function to get page comments.
 *  v 1.04 - 2015.12.21 > Added function to check only relevant objects.
 *  v 1.05 - 2015.12.25 > Added check to wait bitmap loading.
 *  v 1.06 - 2015.12.31 > Added rgb to hex and hex to rgb functions.
 *                      > Added function to get plugins parameters.     
 *  v 1.07 - 2016.01.07 > Fixed issue with plugin order checks.
 *  v 1.08 - 2016.01.17 > Added function to get BattleLog method index.
 *                      > Added function to insert methods on BattleLog.
 *  v 1.09 - 2016.01.24 > Added function to set wait for animations.
 *  v 1.10 - 2016.02.05 > Added function to get values from regex.
 *  v 1.11 - 2016.02.10 > Added function to capitalize texts.
 *                      > Added Plugin Parameter to set trait display names.
 *  v 1.12 - 2016.02.18 > Added function to get parameter names.
 *  v 1.13 - 2016.02.26 > Added functions to setup battler direction.
 *  v 1.14 - 2016.03.15 > Added functions to check opponents.
 *  v 1.15 - 2016.03.18 > Added function for compatibility with YEP.
 *  v 1.16 - 2016.03.23 > Added function to replace mathods.
 *                        Added functions for dynamic motions.
 *  v 1.17 - 2016.04.01 > Fixed issue with battler sprite check.
 *  v 1.18 - 2016.04.21 > Fixed issue with damage popup on action user.
 *  v 1.19 - 2016.04.30 > Added function to get evaluated font color.
 *  v 1.20 - 2016.05.12 > Added function to get width of text with escape codes.
 *  v 1.21 - 2016.05.31 > Improved method stack for dynamic motions.
 *                      > Added functions for compatibility with Battle Motions.
 *  v 1.22 - 2016.06.26 > Added functions for escape command.
 *  v 1.23 - 2017.05.25 > Added functions for damage formula.
 * ===============================================================================
 */

(function() {

    //=============================================================================
    // Parameters
    //=============================================================================

    VictorEngine.getPluginParameters = function() {
        var script = document.currentScript || (function() {
            var scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();
        var start = script.src.lastIndexOf('/') + 1;
        var end = script.src.indexOf('.js');
        return PluginManager.parameters(script.src.substring(start, end));
    }

    var parameters = VictorEngine.getPluginParameters();
    VictorEngine.Parameters = VictorEngine.Parameters || {};
    VictorEngine.Parameters.BasicModule = {};

    //=============================================================================
    // DataManager
    //=============================================================================

    VictorEngine.BasicModule.isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function() {
        if (!VictorEngine.BasicModule.isDatabaseLoaded.call(this)) return false;
        VictorEngine.loadParameters();
        VictorEngine.loadNotetags();
        return ImageManager.isReady();
    };

    //=============================================================================
    // VictorEngine
    //=============================================================================

    VictorEngine.BasicModule.checkPlugins = function(name, req, ver) {
        var msg = '';
        this.loadedPlugins = this.loadedPlugins || {};
        if (ver && req && (!Imported[req] || Number(Imported[req]) < Number(ver))) {
            msg += 'The plugin ' + name + ' requires the plugin ' + req;
            msg += ' v' + ver + ' or higher installed to work properly'
            if (Number(Imported[req]) < Number(ver)) {
                msg += '. Your current version is v' + Imported[req];
            }
            msg += '. Go to http://victorenginescripts.wordpress.com/'
            msg += ' to download the updated plugin.';
            throw msg;
        } else if (!ver && req && this.loadedPlugins[req] === true) {
            msg += 'The plugin ' + name + ' requires the plugin ' + req;
            msg += ' to be placed bellow it. Open the Plugin Manager and place';
            msg += ' the plugins in the correct order.';
            throw msg;
        } else if (req && Imported['VE - Basic Module'] && !this.loadedPlugins['VE - Basic Module']) {
            msg += 'The plugin ' + name + ' must be placed bellow the plugin ' + req;
            msg += '. Open the Plugin Manager and place';
            msg += ' the plugins in the correct order.';
            throw msg;
        } else {
            this.loadedPlugins[name] = true
        }
    };

    VictorEngine.loadNotetags = function() {
        if (VictorEngine.BasicModule.loaded) return;
        VictorEngine.BasicModule.loaded = true;
        var list = [$dataActors, $dataClasses, $dataSkills, $dataItems, $dataWeapons,
            $dataArmors, $dataEnemies, $dataStates
        ];
        list.forEach(function(objects, index) {
            this.processNotetags(objects, index)
        }, this);
    };

    VictorEngine.processNotetags = function(objects, index) {
        objects.forEach(function(data) {
            if (data) {
                this.loadNotetagsValues(data, index);
            }
        }, this);
    };

    VictorEngine.objectSelection = function(index, list) {
        var objects = ['actor', 'class', 'skill', 'item', 'weapon', 'armor', 'enemy', 'state'];
        return list.contains(objects[index]);
    };

    VictorEngine.loadNotetagsValues = function(data, index) {};

    VictorEngine.loadParameters = function() {};

    VictorEngine.getNotesValues = function(value1, value2) {
        value2 = value2 || value1;
        return new RegExp('<' + value1 + '>([\\s\\S]*?)<\\/' + value2 + '>', 'gi');
    };

    VictorEngine.getPageNotes = function(event) {
        var result = (event instanceof Game_CommonEvent) || event.page();
        if (!result || !event.list()) {
            return "";
        }
        return event.list().reduce(function(r, cmd) {
            var valid = (cmd.code === 108 || cmd.code === 408);
            var comment = valid ? cmd.parameters[0] + "\r\n" : "";
            return r + comment;
        }, "");
    };

    VictorEngine.getAllElements = function(subject, action) {
        if (action.item().damage.elementId < 0) {
            return subject.attackElements();
        } else {
            return [action.item().damage.elementId];
        }
    };

    VictorEngine.getAllStates = function(subject, item) {
        var result;
        return item.effects.reduce(function(r, effect) {
            if (effect.code === 21) {
                if (effect.dataId === 0) {
                    result = subject.attackStates();
                } else {
                    result = [effect.dataId];
                };
            } else {
                result = [];
            };
            return r.concat(result);
        }, []);
    };

    VictorEngine.getDamageFormula = function(action) {
		return action.item().damage.formula;
    };

    VictorEngine.getNumberValue = function(match, type, base) {
        var regex = new RegExp(type + '[ ]*:[ ]*([+-.\\d]+)', 'gi');
        var value = regex.exec(match);
        return value ? Number(value[1]) : base;
    };

    VictorEngine.getStringValue = function(match, type, base) {
        var regex = new RegExp(type + "[ ]*:[ ]*([\\w ]+)", 'gi');
        var value = regex.exec(match);
        return value ? value[1].trim() : base;
    };

    VictorEngine.getAnyValue = function(match, type, base) {
        var regex = new RegExp(type + "[ ]*:[ ]*('[^\']+'|\"[^\"]+\")", 'gi');
        var value = regex.exec(match);
        return value ? value[1].slice(1, -1) : base;
    };

    VictorEngine.getNumberValues = function(match, type) {
        var regex = new RegExp(type + '[ ]*:[ ]*((?:[+-.\\d]+[ ]*,?[ ]*)+)', 'gi');
        var value = regex.exec(match);
        var result = value ? value[1].match(/\d+/gi) : [];
        return result.map(function(id) {
            return Number(id)
        });
    };

    VictorEngine.getStringValues = function(match, type) {
        var regex = new RegExp(type + '[ ]*:[ ]*((?:[\\w ]+[ ]*,?[ ]*)+)', 'gi');
        var value = regex.exec(match);
        var result = value ? value[1].match(/\d+/gi) : [];
        return result.map(function(id) {
            return value[1].trim()
        });
    };

    VictorEngine.captalizeText = function(text) {
        return text.replace(/(?:^|\s)\S/g, function(a) {
            return a.toUpperCase();
        });
    };

    VictorEngine.replaceZeros = function(text, value) {
        value = value || '';
        return text.replace(/\b(0(?!\b))+/g, function(a) {
            return a.replace(/0/g, value);
        });
    };

    VictorEngine.rgbToHex = function(r, g, b) {
        r = Math.floor(r).toString(16).padZero(2);
        g = Math.floor(g).toString(16).padZero(2);
        b = Math.floor(b).toString(16).padZero(2);
        return '#' + r + g + b;
    }

    VictorEngine.hexToRgb = function(hex) {
        var r = parseInt(hex[1] + hex[2], 16);
        var g = parseInt(hex[3] + hex[4], 16);
        var b = parseInt(hex[5] + hex[6], 16);
        return [r, g, b];
    }

    VictorEngine.methodIndex = function(methods, name) {
        for (var i = 0; i < methods.length; i++) {
            if (methods[i] && methods[i].name === name) {
                return i;
            }
        }
        return null;
    }

    VictorEngine.removeMethod = function(methods, name) {
        var index = this.methodIndex(methods, name);
        if (index || index === 0) {
            methods.splice(index, 1);
        }
    }

    VictorEngine.insertMethod = function(methods, index, name, params) {
        if (index || index === 0) {
            methods.splice(index, 0, {
                name: name,
                params: params
            });
        }
    }

    VictorEngine.replaceMethod = function(methods, index, name, params) {
        if (index || index === 0) {
            methods.splice(index, 1, {
                name: name,
                params: params
            });
        }
    }



    //=============================================================================
    // SceneManager
    //=============================================================================

    SceneManager.sceneSpriteset = function() {
        return this._scene ? this._scene._spriteset : null;
    };

    //=============================================================================
    // Window_Base
    //=============================================================================

    Window_Base.prototype.getFontColor = function(color) {
        if (color.match(/^\#[abcdef\d]{6}/i)) {
            return '"' + color + '"';
        } else {
            return color;
        }
    };


})();