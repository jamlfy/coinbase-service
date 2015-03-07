# Coinbase

Coinbase is a wrapper around the Coinbase.com bitcoin wallet and exchange API.

Require coinbase

```javascript
var CoinbaseApi = require('coinbase-service');
var coinbase = new CoinbaseApi({
  APIKey: process.env.COINBASE_API_KEY,
  APISecret: process.env.COINBASE_API_SECRET
});
```
I will not explain the method by method. I'll make a simple explanation!

```javascript
coinbase[method]([object], function(err, data){
  // buttons except
});
coinbase[method][get|balance|delete|refunds|commit|cancel|complete|resend](id, function(err, data){
  // More
});
coinbase[method][create|OAuth2|sendMoney|transferMoney|button|redeem]({
  // Your arguments
}, function(err, data){
  // More
});
coinbase[method][update|sell](id, {
  // Your arguments
}, function(err, data){
  // More
});
```
All the list of methods

* [Account](https://developers.coinbase.com/api#accounts)
 * [`coinbase.account`](https://developers.coinbase.com/api#list-accounts)
 * [`coinbase.account.get`](https://developers.coinbase.com/api#show-an-account)
 * [`coinbase.account.changes`](https://developers.coinbase.com/api#account-changes)
 * [`coinbase.account.create`](https://developers.coinbase.com/api#create-an-account)
 * [`coinbase.account.update`](https://developers.coinbase.com/api#modify-an-account)
 * [`coinbase.account.primary`](https://developers.coinbase.com/api#set-account-as-primary)
 * [`coinbase.account.delete`](https://developers.coinbase.com/api#delete-an-account)
 * [`coinbase.account.balance`](https://developers.coinbase.com/api#get-account39s-balance)
 * [`coinbase.account.address`](https://developers.coinbase.com/api#get-account39s-bitcoin-address)
 * [`coinbase.account.address.create`](https://developers.coinbase.com/api#create-a-new-bitcoin-address-for-an-account)
* [Addresses](https://developers.coinbase.com/api#addresses)
 * [`coinbase.address`](https://developers.coinbase.com/api#list-bitcoin-addresses)
 * [`coinbase.address.get`](https://developers.coinbase.com/api#show-bitcoin-address)
* [Authorization](https://developers.coinbase.com/api#authorization)
 * [`coinbase.authorization`](https://developers.coinbase.com/api#show-authorization-information)
* [Buttons](https://developers.coinbase.com/api#buttons)
 * [`coinbase.button`](https://developers.coinbase.com/api#create-a-new-payment-button-page-or-iframe)
 * [`coinbase.button.get`](https://developers.coinbase.com/api#show-a-button)
 * [`coinbase.button.createOrder`](https://developers.coinbase.com/api#create-an-order-for-a-button)
 * [`coinbase.button.orders`](https://developers.coinbase.com/api#list-orders-for-a-button)
* [Buys](https://developers.coinbase.com/api#buys)
 * [`coinbase.buys`](https://developers.coinbase.com/api#buy-bitcoin)
* [Contacts](https://developers.coinbase.com/api#contacts)
 * [`coinbase.contacts`](https://developers.coinbase.com/api#list-emails-the-user-has-previously-used-for-autocompletion)
* [Currencies](https://developers.coinbase.com/api#currencies)
 * [`coinbase.currencies`](https://developers.coinbase.com/api#list-currencies-supported-by-coinbase)
 * [`coinbase.currencies.exchangeRates`](https://developers.coinbase.com/api#list-exchange-rates-between-btc-and-other-currencies)
* [Multisig](https://developers.coinbase.com/api#multisig)
 * [`coinbase.multisig`](https://developers.coinbase.com/api#create-a-multisig-account)
 * [`coinbase.multisig.transaction`](https://developers.coinbase.com/api#create-a-multisig-transaction)
 * [`coinbase.multisig.sighashes`](https://developers.coinbase.com/api#get-signature-hashes-for-each-input-that-needs-signing-in-a-spend-from-multisig-transaction)
 * [`coinbase.multisig.signatures`](https://developers.coinbase.com/api#submit-required-signatures-for-a-multisig-spend-transaction)
* [Aplications](https://developers.coinbase.com/api#oauth-applications)
 * [`coinbase.app`](https://developers.coinbase.com/api#list-oauth-applications)
 * [`coinbase.app.get`](https://developers.coinbase.com/api#show-an-oauth-application)
 * [`coinbase.app.create`](https://developers.coinbase.com/api#create-an-oauth-application)
* [Orders](https://developers.coinbase.com/api#orders)
 * [`coinbase.orders`](https://developers.coinbase.com/api#list-orders)
 * [`coinbase.orders.create`](https://developers.coinbase.com/api#create-an-order)
 * [`coinbase.orders.get`](https://developers.coinbase.com/api#show-an-order)
 * [`coinbase.orders.refunds`](https://developers.coinbase.com/api#refund-an-order)
* [Payment methods](https://developers.coinbase.com/api#payment-methods)
 * [`coinbase.payment`](https://developers.coinbase.com/api#list-payment-methods)
 * [`coinbase.payment.show`](https://developers.coinbase.com/api#show-a-payment-method)
* [Prices](https://developers.coinbase.com/api#prices)
 * [`coinbase.price`](https://developers.coinbase.com/api#get-the-buy-price-for-bitcoin)
 * [`coinbase.price.sell`](https://developers.coinbase.com/api#get-the-sell-price)
 * [`coinbase.price.spotRate`](https://developers.coinbase.com/api#get-the-spot-price-of-bitcoin)
 * [`coinbase.price.historical`](https://developers.coinbase.com/api#get-the-historical-spot-price)
* [Recurring payments](https://developers.coinbase.com/api#recurring-payments)
 * [`coinbase.recurringPayments`](https://developers.coinbase.com/api#list-recurring-payments)
 * [`coinbase.recurringPayments.get`](https://developers.coinbase.com/api#show-a-recurring-payment)
* [Reports](https://developers.coinbase.com/api#reports)
 * [`coinbase.reports`](https://developers.coinbase.com/api#list-all-reports)
 * [`coinbase.reports.get`](https://developers.coinbase.com/api#show-a-report)
 * [`coinbase.reports.create`](https://developers.coinbase.com/api#generate-a-new-report)
* [Sell](https://developers.coinbase.com/api#sells)
 * [`coinbase.sell`](https://developers.coinbase.com/api#sell-bitcoin)
* [Subscriptions](https://developers.coinbase.com/api#subscriptions)
 * [`coinbase.subscribers`](https://developers.coinbase.com/api#list-subscriptions)
 * [`coinbase.subscribers.get`](https://developers.coinbase.com/api#show-a-subscription)
* [Tokens](https://developers.coinbase.com/api#tokens)
 * [`coinbase.tokens`](https://developers.coinbase.com/api#create-a-token-which-can-be-redeemed-for-bitcoin)
 * [`coinbase.tokens.redeem`](https://developers.coinbase.com/api#redeem-a-token-claiming-its-address-and-all-its-bitcoin)
* [Transactions](https://developers.coinbase.com/api#transactions)
 * [`coinbase.transactions`](https://developers.coinbase.com/api#list-transactions)
 * [`coinbase.transactions.get`](https://developers.coinbase.com/api#show-a-transaction)
 * [`coinbase.transactions.sendMoney`](https://developers.coinbase.com/api#send-money)
 * [`coinbase.transactions.sendMoney.resend`](https://developers.coinbase.com/api#resend-bitcoin-request)
 * [`coinbase.transactions.transferMoney`](https://developers.coinbase.com/api#transfer-money-between-accounts)
 * [`coinbase.transactions.transferMoney.complete`](https://developers.coinbase.com/api#complete-bitcoin-request)
 * [`coinbase.transactions.requestMoney`](https://developers.coinbase.com/api#complete-bitcoin-request)
 * [`coinbase.transactions.requestMoney.cancel`](https://developers.coinbase.com/api#cancel-bitcoin-request)
* [Transfers](https://developers.coinbase.com/api#transfers)
 * [`coinbase.transfers`](https://developers.coinbase.com/api#list-buy-and-sell-history)
 * [`coinbase.transfers.get`](https://developers.coinbase.com/api#show-a-transfer)
 * [`coinbase.transfers.commit`](https://developers.coinbase.com/api#start-a-transfer-that-is-in-the-created-state)
* [Users](https://developers.coinbase.com/api#users)
 * [`coinbase.user`](https://developers.coinbase.com/api#get-current-user)
 * [`coinbase.user.create`](https://developers.coinbase.com/api#create-a-new-user)
 * [`coinbase.user.OAuth2`](https://developers.coinbase.com/api#create-a-new-user-for-oauth2-application)
 * [`coinbase.user.update`](https://developers.coinbase.com/api#modify-current-user)

