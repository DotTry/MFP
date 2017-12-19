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
var product_1 = require("nativescript-purchase/product");
var transaction_1 = require("nativescript-purchase/transaction");
var common = require("./purchase-common");
global.moduleMerge(common, exports);
var productRequest;
var productIds;
var productRequestDelegate;
var paymentTransactionObserver;
function init(productIdentifiers) {
    return new Promise(function (resolve, reject) {
        productIds = NSMutableSet.alloc().init();
        paymentTransactionObserver = new SKPaymentTransactionObserverImpl();
        productIdentifiers.forEach(function (value) { return productIds.addObject(value); });
        SKPaymentQueue.defaultQueue().addTransactionObserver(paymentTransactionObserver);
        resolve();
    });
}
exports.init = init;
function getProducts() {
    return new Promise(function (resolve, reject) {
        productRequest = SKProductsRequest.alloc().initWithProductIdentifiers(productIds);
        productRequestDelegate = SKProductRequestDelegateImpl.initWithResolveReject(resolve, reject);
        productRequest.delegate = productRequestDelegate;
        productRequest.start();
    });
}
exports.getProducts = getProducts;
function buyProduct(product) {
    if (!product.nativeValue) {
        throw "Invalid Product! (missing native value)";
    }
    var payment = SKPayment.paymentWithProduct(product.nativeValue);
    SKPaymentQueue.defaultQueue().addPayment(payment);
}
exports.buyProduct = buyProduct;
function consumePurchase(token) {
    return new Promise(function (resolve, reject) {
        resolve(0);
    });
}
exports.consumePurchase = consumePurchase;
function restorePurchases() {
    SKPaymentQueue.defaultQueue().restoreCompletedTransactions();
}
exports.restorePurchases = restorePurchases;
function canMakePayments() {
    return SKPaymentQueue.canMakePayments();
}
exports.canMakePayments = canMakePayments;
var SKProductRequestDelegateImpl = (function (_super) {
    __extends(SKProductRequestDelegateImpl, _super);
    function SKProductRequestDelegateImpl() {
        return _super.apply(this, arguments) || this;
    }
    SKProductRequestDelegateImpl.initWithResolveReject = function (resolve, reject) {
        var delegate = SKProductRequestDelegateImpl.new();
        delegate._resolve = resolve;
        delegate._reject = reject;
        return delegate;
    };
    SKProductRequestDelegateImpl.prototype.productsRequestDidReceiveResponse = function (request, response) {
        var products = response.products;
        var result = [];
        for (var loop = 0; loop < products.count; loop++) {
            result.push(new product_1.Product(products.objectAtIndex(loop)));
        }
        this._resolve(result);
        this._cleanup();
    };
    SKProductRequestDelegateImpl.prototype.requestDidFailWithError = function (request, error) {
        this._reject(new Error(error.localizedDescription));
        this._cleanup();
    };
    SKProductRequestDelegateImpl.prototype._cleanup = function () {
        productRequestDelegate = null;
        productRequest = null;
    };
    return SKProductRequestDelegateImpl;
}(NSObject));
SKProductRequestDelegateImpl.ObjCProtocols = [SKProductsRequestDelegate];
var SKPaymentTransactionObserverImpl = (function (_super) {
    __extends(SKPaymentTransactionObserverImpl, _super);
    function SKPaymentTransactionObserverImpl() {
        return _super.apply(this, arguments) || this;
    }
    SKPaymentTransactionObserverImpl.prototype.paymentQueueUpdatedTransactions = function (queue, transactions) {
        for (var loop = 0; loop < transactions.count; loop++) {
            var transaction = transactions.objectAtIndex(loop);
            var resultTransaction = new transaction_1.Transaction(transaction);
            common._notify(common.transactionUpdatedEvent, resultTransaction);
            if (transaction.transactionState === 2 /* Failed */
                || transaction.transactionState === 1 /* Purchased */
                || transaction.transactionState === 3 /* Restored */) {
                SKPaymentQueue.defaultQueue().finishTransaction(transaction);
            }
        }
    };
    return SKPaymentTransactionObserverImpl;
}(NSObject));
SKPaymentTransactionObserverImpl.ObjCProtocols = [SKPaymentTransactionObserver];
