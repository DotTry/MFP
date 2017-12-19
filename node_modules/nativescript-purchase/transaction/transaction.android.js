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
        if (nativeValue) {
            switch (nativeValue.getInt("purchaseState")) {
                case 0:
                    _this.transactionState = common.TransactionState.Purchased;
                    break;
                case 1:
                    _this.transactionState = common.TransactionState.Failed;
                    break;
                case 2:
                    _this.transactionState = common.TransactionState.Refunded;
                    break;
            }
            _this.productIdentifier = nativeValue.getString("productId");
            _this.transactionReceipt = nativeValue.getString("purchaseToken");
            if (nativeValue.has("signature")) {
                _this.dataSignature = nativeValue.getString("signature");
            }
            if (nativeValue.has("orderId")) {
                _this.transactionIdentifier = nativeValue.getString("orderId");
            }
            if (nativeValue.has("developerPayload")) {
                _this.developerPayload = nativeValue.getString("developerPayload");
            }
            if (nativeValue.getLong("purchaseTime")) {
                _this.transactionDate = new Date(nativeValue.getLong("purchaseTime"));
            }
        }
        return _this;
    }
    return Transaction;
}(common.Transaction));
exports.Transaction = Transaction;
