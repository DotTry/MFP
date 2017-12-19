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
var Transaction = (function () {
    function Transaction(nativeValue) {
        this.nativeValue = nativeValue;
    }
    return Transaction;
}());
exports.Transaction = Transaction;
var TransactionState = (function () {
    function TransactionState() {
    }
    return TransactionState;
}());
TransactionState.Purchased = "purchased";
TransactionState.Restored = "restored";
TransactionState.Failed = "failed";
TransactionState.Deferred = "deferred";
TransactionState.Purchasing = "purchasing";
TransactionState.Refunded = "refunded";
exports.TransactionState = TransactionState;
