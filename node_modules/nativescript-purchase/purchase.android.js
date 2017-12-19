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
var common = require("./purchase-common");
var application = require("application");
var types = require("utils/types");
var product_1 = require("nativescript-purchase/product");
var transaction_1 = require("nativescript-purchase/transaction");
global.moduleMerge(common, exports);
var helper;
var currentBuyPayload;
var currentBuyProductIdentifier;
function init(productIdentifiers) {
    return new Promise(function (resolve, reject) {
        var nativeArray = Array.create(java.lang.String, productIdentifiers.length);
        for (var loop = 0; loop < productIdentifiers.length; loop++) {
            nativeArray[loop] = productIdentifiers[loop].toLowerCase(); // Android product IDs are all lower case
        }
        ensureApplicationContext().then(function () {
            helper = new com.tangrainc.inappbilling.InAppBillingHelper(application.android.context, nativeArray);
            resolve();
        });
        application.android.on(application.AndroidApplication.activityResultEvent, function (args) {
            if (args.requestCode === com.tangrainc.inappbilling.InAppBillingHelper.BUY_INTENT_REQUEST_CODE) {
                var intent = args.intent;
                var responseCode = intent.getIntExtra("RESPONSE_CODE", 0);
                var purchaseData = intent.getStringExtra("INAPP_PURCHASE_DATA");
                var dataSignature = intent.getStringExtra("INAPP_DATA_SIGNATURE");
                var tran = void 0;
                if (args.resultCode === android.app.Activity.RESULT_OK && responseCode === 0 && !types.isNullOrUndefined(purchaseData)) {
                    var nativeValue = new org.json.JSONObject(purchaseData);
                    nativeValue.put("signature", dataSignature);
                    tran = new transaction_1.Transaction(nativeValue);
                }
                else {
                    tran = new transaction_1.Transaction(null);
                    tran.transactionState = transaction_1.TransactionState.Failed;
                    tran.productIdentifier = currentBuyProductIdentifier;
                    tran.developerPayload = currentBuyPayload;
                }
                common._notify(common.transactionUpdatedEvent, tran);
            }
        });
    });
}
exports.init = init;
function getProducts() {
    return new Promise(function (resolve, reject) {
        futureToPromise(helper.getProducts())
            .then(function (result) {
            var productArray = [];
            for (var loop = 0; loop < result.length; loop++) {
                productArray.push(new product_1.Product(result[loop]));
            }
            resolve(productArray);
        })
            .catch(reject);
    });
}
exports.getProducts = getProducts;
function buyProduct(product, developerPayload) {
    var tran = new transaction_1.Transaction(null);
    tran.transactionState = transaction_1.TransactionState.Purchasing;
    tran.productIdentifier = product.productIdentifier;
    tran.developerPayload = developerPayload;
    common._notify(common.transactionUpdatedEvent, tran);
    currentBuyProductIdentifier = product.productIdentifier;
    currentBuyPayload = developerPayload;
    helper.startBuyIntent(application.android.foregroundActivity, product.productIdentifier, developerPayload || "");
}
exports.buyProduct = buyProduct;
function consumePurchase(token) {
    return new Promise(function (resolve, reject) {
        futureToPromise(helper.consumePurchase(token)).then(resolve, reject);
    });
}
exports.consumePurchase = consumePurchase;
function restorePurchases() {
    futureToPromise(helper.getPurchases())
        .then(function (result) {
        for (var loop = 0; loop < result.length; loop++) {
            var tran = new transaction_1.Transaction(null);
            tran.originalTransaction = new transaction_1.Transaction(result[loop]);
            tran.transactionState = transaction_1.TransactionState.Restored;
            common._notify(common.transactionUpdatedEvent, tran);
        }
    });
}
exports.restorePurchases = restorePurchases;
function canMakePayments() {
    return true;
}
exports.canMakePayments = canMakePayments;
function futureToPromise(future /* ListenableFuture */) {
    return new Promise(function (resolve, reject) {
        com.google.common.util.concurrent.Futures.addCallback(future, new com.google.common.util.concurrent.FutureCallback({
            onSuccess: function (result) {
                resolve(result);
            },
            onFailure: function (t /* Throwable */) {
                reject(new Error(t.getMessage()));
            }
        }));
    });
}
function ensureApplicationContext() {
    return new Promise(function (resolve, reject) {
        if (application.android && application.android.context) {
            resolve();
            return;
        }
        application.on(application.launchEvent, function (args) {
            resolve();
        });
    });
}
