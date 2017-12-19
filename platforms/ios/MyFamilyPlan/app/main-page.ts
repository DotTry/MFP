/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/
import {Observable} from 'data/observable';
import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import { HelloWorldModel } from './main-view-model';
import * as applicationSettings from "application-settings";
import * as purchase from "nativescript-purchase";
import { Transaction, TransactionState } from "nativescript-purchase/transaction";
import { Product } from "nativescript-purchase/product";
import { ItemEventData } from "ui/list-view";

let viewModel: Observable;

// Event handler for Page "navigatingTo" event attached in main-page.xml
export function navigatingTo(args: EventData) {
    let page = <Page>args.object;

    // viewModel = new Observable({
    //     items: [],
    //     loading: true
    // });
    var ObservableModule = require("data/observable");

 viewModel = ObservableModule.fromObject({
      items: [],
           loading: true
    });
    page.bindingContext = viewModel;

    purchase.getProducts() //load from ITuns/ giigke okay
        .then((res) => {
        console.log("nice");
            viewModel.set("items", res);
            viewModel.set("loading", false);
        })
        .catch((e) => console.log(e));

        purchase.on(purchase.transactionUpdatedEvent, (transaction: Transaction) => {
         if (transaction.transactionState === TransactionState.Restored) {
             applicationSettings.setBoolean(transaction.productIdentifier, true); /* 1 purchase restore*/
         }
         if (transaction.transactionState === TransactionState.Purchased) {
             if (transaction.productIdentifier.indexOf(".product2") >= 0) { /* 2 consumablepurchase*/
                 purchase.consumePurchase(transaction.transactionReceipt) /* 3 */
                     .then((responseCode) => {
                         if (responseCode === 0) {
                             // Provision your user with their digital goods bought.
                         }
                     })
                     .catch((e) => console.log(e));
             }
             else {
                 applicationSettings.setBoolean(transaction.productIdentifier, true); /* 4 user has purchased, set the prodct id*/
             }
         }
     });
}

export function onProductTap(data: ItemEventData) {
    let product = viewModel.get("items")[data.index] as Product;
    console.log("buy");
    purchase.buyProduct(product);
}

export function onRestoreTap() {
    console.log("restored");
    purchase.restorePurchases();
}
