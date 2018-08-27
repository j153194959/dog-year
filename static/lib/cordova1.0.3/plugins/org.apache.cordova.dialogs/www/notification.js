cordova.define("org.apache.cordova.dialogs.notification",function(require,exports,module){var exec=require('cordova/exec');var platform=require('cordova/platform');module.exports={alert:function(message,completeCallback,title,buttonLabel){var _title=(title||"Alert");var _buttonLabel=(buttonLabel||"OK");exec(completeCallback,null,"Notification","alert",[message,_title,_buttonLabel]);},confirm:function(message,resultCallback,title,buttonLabels){var _title=(title||"Confirm");var _buttonLabels=(buttonLabels||["OK","Cancel"]);if(typeof _buttonLabels==='string'){console.log("Notification.confirm(string, function, string, string) is deprecated.  Use Notification.confirm(string, function, string, array).");}
    if(platform.id=="amazon-fireos"||platform.id=="android"||platform.id=="ios"||platform.id=="windowsphone"||platform.id=="firefoxos"||platform.id=="ubuntu"){if(typeof _buttonLabels==='string'){var buttonLabelString=_buttonLabels;_buttonLabels=_buttonLabels.split(",");}}else{if(Array.isArray(_buttonLabels)){var buttonLabelArray=_buttonLabels;_buttonLabels=buttonLabelArray.toString();}}
    exec(resultCallback,null,"Notification","confirm",[message,_title,_buttonLabels]);},prompt:function(message,resultCallback,title,buttonLabels,defaultText){var _message=(message||"Prompt message");var _title=(title||"Prompt");var _buttonLabels=(buttonLabels||["OK","Cancel"]);var _defaultText=(defaultText||"");exec(resultCallback,null,"Notification","prompt",[_message,_title,_buttonLabels,_defaultText]);},beep:function(count){exec(null,null,"Notification","beep",[count]);}};});