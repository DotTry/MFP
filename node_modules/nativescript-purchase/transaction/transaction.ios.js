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
var common = require("./transaction-common");
global.moduleMerge(common, exports);
var Transaction = (function (_super) {
    __extends(Transaction, _super);
    function Transaction(nativeValue) {
        var _this = _super.call(this, nativeValue) || this;
        switch (nativeValue.transactionState) {
            case 4 /* Deferred */:
                _this.transactionState = common.TransactionState.Deferred;
                break;
            case 2 /* Failed */:
                _this.transactionState = common.TransactionState.Failed;
                break;
            case 1 /* Purchased */:
                _this.transactionState = common.TransactionState.Purchased;
                break;
            case 0 /* Purchasing */:
                _this.transactionState = common.TransactionState.Purchasing;
                break;
            case 3 /* Restored */:
                _this.transactionState = common.TransactionState.Restored;
                _this.originalTransaction = new Transaction(nativeValue.originalTransaction);
                break;
        }
        _this.productIdentifier = nativeValue.payment.productIdentifier;
        _this.transactionIdentifier = nativeValue.transactionIdentifier;
        if (nativeValue.transactionDate) {
            _this.transactionDate = nativeValue.transactionDate; // NSDate will automatically be bridged to date
        }
        if (nativeValue.transactionReceipt) {
            _this.transactionReceipt = nativeValue.transactionReceipt.base64EncodedStringWithOptions(1 /* Encoding64CharacterLineLength */);
        }
        return _this;
    }
    return Transaction;
}(common.Transaction));
exports.Transaction = Transaction;
