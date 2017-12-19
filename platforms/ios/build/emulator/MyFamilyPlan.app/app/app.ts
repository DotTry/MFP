/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import "./bundle-config";
import * as app from 'application';
import * as purchase from "nativescript-purchase";

purchase.init([
    "org.nativescript.MyFamilyPlan.product2"
]);

app.start({ moduleName: 'main-page' });
