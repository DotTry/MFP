/*! *****************************************************************************
Copyright (c) 2016 Tangra Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
***************************************************************************** */
"use strict";
var observers = {};
exports.transactionUpdatedEvent = "transactionUpdated";
function _notify(eventName, data) {
    if (!observers[eventName]) {
        return;
    }
    observers[eventName].forEach(function (callback) { callback(data); });
}
exports._notify = _notify;
function on(eventName, handler) {
    if (!observers[eventName]) {
        observers[eventName] = [];
    }
    observers[eventName].push(handler);
}
exports.on = on;
function off(eventName, handler) {
    if (!observers[eventName]) {
        return;
    }
    if (!handler) {
        observers[eventName].splice(0);
        return;
    }
    var index = observers[eventName].indexOf(handler);
    if (index !== -1) {
        observers[eventName].splice(index, 1);
    }
}
exports.off = off;
