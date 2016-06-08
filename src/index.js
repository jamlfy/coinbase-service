import {version, name} from '../package.json';
import {HmacSHA256} from 'crypto-js'; 
import {stringify} from 'querystring'; 
import microtime from 'microtime'; 
import request from 'request'; 

/**
 * Example:
 * let coin  = new coinbase(KEY, SECRET);
 * coin.transactions.sendMoney({
 * 		
 * }, (err, data) => console.log(err, data) );
 *
 */

export default coinbase;
export class coinbase {
	/**
	 * @param  {String} APIKey              API Key
	 * @param  {String} APISecret           API Secret
	 * @param  {String} options.baseUrl     URL
	 */
	constructor(APIKey, APISecret, baseUrl='https://api.coinbase.com/v1/') {
		if (!APIKey || !APISecret ){
			throw new Error('Must provide an APIKey in order to interact with the coinbase api');	
		}

		this.counter = 0;
		this.last = '';
		this.headers = {
			'User-Agent': `${name}/${version}`,
			'content-type':  'application/json',
			'ACCESS_KEY' : APIKey
		};

		this.__apiSecret = APISecret;
		this.__baseUrl = baseUrl;

		// Accounts
		/* GET /accounts */
		this.account = (obj, cb) => this.__Send('get', `accounts`, obj, cb);
		/* GET /accounts/:id */
		this.account.get = (id, cb) => this.__Send('get', `accounts/${id}`, null, cb);
		/* GET /account_changes */
		this.account.changes = (obj, cb) => this.__Send('get', 'account_changes', obj, cb);
		/* POST /accounts */
		this.account.create = (obj, cb) => this.__Send('post', 'accounts', obj, cb);
		/* PUT /accounts/:account_id */
		this.account.update = (id, obj, cb) => this.__Send('put', `accounts/${id}`, obj, cb);
		/* POST /accounts/:account_id/primary */
		this.account.primary = (id, cb) => this.__Send('post', `accounts/${id}`, null, cb);
		/* DELETE /accounts/:account_id */
		this.account.delete = (id, cb) => this.__Send( 'delete', `accounts/${id}`, null, cb);
		/* GET /accounts/:id/balance */
		this.account.balance = (id, cb) => this.__Send('get', `accounts/${id}/balance`, null, cb);
		/* GET /accounts/:id/address */
		this.account.address = (id, cb) => this.__Send('get', `accounts/${id}/address`, null, cb);
		/* POST /accounts/:account_id/addres */
		this.account.address.create = (id, obj, cb) => this.__Send('post', `accounts/${id}/address`, obj, cb);

		// Addresses
		/* GET /addresses */
		this.address = (obj, cb) => this.__Send('get','addresses', obj, cb);
		/* GET /addresses/:id_or_address */
		this.address.get = (id, cb) => this.__Send('get', `addresses/${id}`, null, cb);

		// Authorization
		/* GET /authorization */
		this.authorization = (cb) => this.__Send('get', 'authorization', cb);

		// Button
		/* POST /buttons */
		this.button = (obj, cb) => this.__Send('post', 'buttons', obj, cb);
		/* GET /buttons/:id */
		this.button.get = (id, cb) => this.__Send('get', `buttons/${id}`, null, cb);
		/* POST /buttons/:id/create_order */
		this.button.createOrder = (id, cb) => this.__Send('post', `buttons/${id}/create_order`, null, cb);
		/* GET /buttons/:id_or_custom_value/orders */
		this.button.orders = (id, obj, cb) => this.__Send('get', `buttons/${id}/orders`, obj, cb);


		// Buy
		/* POST /buys */
		this.buys = (obj, cb) => this.__Send('post', 'buys', obj, cb);

		// Contact
		/* GET /contacts */
		this.contacts = (obj, cb) => this.__Send('get', 'contacts', obj, cb);

		// Currencies
		/* GET /currencies */
		this.currencies = ( cb) => this.__Send('get', 'currencies', null, cb);
		/* GET /currencies/exchange_rates */
		this.currencies.exchangeRates = ( cb) => this.__Send('get', 'currencies/exchange_rates', null, cb);

		// multisig
		/* POST /accounts */
		this.multisig = (obj, cb) => this.__Send('post', 'accounts', obj, cb);
		/* POST /transactions/send_money */
		this.multisig.transactions = (obj, cb) => this.__Send('post', 'transactions/send_money', obj, cb);
		/* GET /transactions/:id/sighashes */
		this.multisig.sighashes = (id, cb) => this.__Send('get', `transactions/${id}/sighashes`, null, cb);
		/* PUT /transactions/:id/sighashes */
		this.multisig.signatures = (id, obj, cb) => this.__Send('put', `transactions/${id}/sighashes`, obj, cb);

		// Aplication
		/* GET /oauth/applications */
		this.app = (obj, cb) => this.__Send('get', 'oauth/applications', obj, cb);
		/* GET /oauth/applications/:id */
		this.app.get = (id, cb) => this.__Send('get', `oauth/applications/${id}`, null, cb);
		/* POST /oauth/applications */
		this.app.create = (obj, cb) => this.__Send('post', 'oauth/applications', obj, cb);

		// Order
		/* GET /orders */
		this.orders = (cb) => this.__Send('get', 'orders', null, cb);
		/* POST /orders */
		this.orders.create = (obj, cb) => this.__Send('post', 'orders', obj, cb);
		/* GET /orders/:id */
		this.orders.get = (id, cb) => this.__Send('get', `orders/${id}`, null, cb);
		/* POST /orders/:id */
		this.orders.refunds = (id, obj, cb) => this.__Send('get', `orders/${id}`, obj, cb);

		// Payment method
		/* GET /payment_methods */
		this.payment = (name, cb) => {
			if(typeof name === 'function'){
				cb = name;
				name = '';
			}

			return this.__Send('get', `payment_methods/${name}`, null, cb);
		};
		/* GET /payment_methods/:id */
		this.payment.show = (id, name, cb) => {
			if(typeof name === 'function'){
				cb = name;
				name = '';
			}

			return this.__Send('get', `payment_methods/${id}/${name}`, null, cb);
		};

		// Price
		/* GET /prices/buy */
		this.price = (obj, cb) => {
			if(typeof obj === 'function'){
				cb = obj;
				obj = { qty : 1 };
			}

			return this.__Send('get', 'prices/buy', obj, cb);
		};
		/* GET /prices/buy */
		this.price.sell = (obj, cb) => {
			if(typeof obj === 'function'){
				cb = obj;
				obj = { qty : 1 };
			}

			return this.__Send('get', 'prices/sell', obj, cb);
		};
		/* GET /prices/spot_rate */
		this.price.spotRate = (obj, cb) => this.__Send('get', 'prices/spot_rate', obj, cb);
		/* GET /prices/historical */
		this.price.historical = (obj, cb) => this.__Send('get', 'prices/historical', obj, cb);

		// Recurring payment
		/* GET /recurring_payments */
		this.recurringPayments = (obj, cb) => this.__Send('get','recurring_payments', obj, cb);
		/* GET /recurring_payments/:id */
		this.recurringPayments.get = (id, cb) => this.__Send('get', `recurring_payments/${id}`, null, cb);

		// Report
		/* GET /reports */
		this.reports = (obj, cb) => this.__Send('get', 'reports', obj, cb);
		/* GET /reports/:id */
		this.reports.get = (id,  cb) => this.__Send('get', `reports/${id}`, null, cb);
		/* POST /reports */
		this.reports.create = (obj, cb) => this.__Send('post', 'reports' , obj, cb);


		// Sel
		/* POST /sells */
		this.sell = (obj, cb) => this.__Send('post', 'sells', obj, cb);

		// Subscription
		/* GET /subscribers */
		this.subscribers = (cb) => this.__Send('get', 'subscribers', cb);
		/* GET /subscribers/:id */
		this.subscribers.get = (id, cb) => this.__Send('get', `subscribers/${id}`, null, cb);

		// Token
		/* GET /tokens */
		this.tokens = (id, cb) => this.__Send('post', 'tokens', cb);
		/* GET /tokens/redeem */
		this.tokens.redeem = (obj, cb) => this.__Send('post', 'tokens/redeem', obj, cb);

		// Transaction
		/* GET /transactions */
		this.transactions = (obj, cb) => this.__Send('get', 'transactions', obj, cb);
		/* GET /transactions/:id */
		this.transactions.get = (id, cb) => this.__Send('get', `transactions/${id}`, null, cb);
		/* POST /transactions/send_money */
		this.transactions.sendMoney = (obj, cb) => this.__Send('post','transactions/send_money', obj, cb);
		/* PUT /transactions/:id/resend_request */
		this.transactions.sendMoney.resend = (id, cb) => this.__Send('put', `transactions/${id}/resend_request`, null, cb);
		/* GET /transactions/transfer_money */
		this.transactions.transferMoney = (obj, cb) => this.__Send('post','transactions/transfer_money', obj, cb);
		/* PUT /transactions/:id/complete_request */
		this.transactions.transferMoney.complete = (id, cb) => this.__Send('put', `transactions/${id}/complete_request`, cb);
		/* GET /transactions/request_money */
		this.transactions.requestMoney = (obj, cb) => this.__Send('post','transactions/request_money', obj, cb);
		/* PUT /transactions/:id/complete_request */
		this.transactions.requestMoney.cancel = (id, cb) => this.__Send('put', `transactions/${id}/complete_request`, null, cb);

		// Transfer
		/* GET /transfers */
		this.transfers = (obj, cb) => this.__Send('get', 'transfers', obj, cb);
		/* GET /transfers/:id */
		this.transfers.get = (id, cb) => this.__Send('get', `transfers/${id}`, null, cb);
		/* POST /transfers/:id/commit */
		this.transfers.commit = (id, cb) => this.__Send('post',`transfers/${id}/commit`, null, cb);

		// USER
		/* POST /users/self */
		this.user = (cb) => this.__Send('post','users/self', cb);
		/* POST /users */
		this.user.create = (obj, cb) => this.__Send('post', 'users', obj, cb);
		/* POST /users/ */
		this.user.OAuth2 = (obj, cb) => this.__Send('post', 'users', obj, cb);
		/* PUT /users/:id */
		this.user.update = (id, obj, cb) => this.__Send('put', `users/${id}`, obj, cb);

	}

	__getNonce () {
		if(!this.counter){
			this.counter = 0;
		}
		if(!this.last){
			this.last = '';
		}

		this.counter++;
		var nonce = microtime.now() + '' + (100 + this.counter % 100);
		
		if (nonce < this.last) {
			nonce = this.__getNonce();
			this.last = nonce;
		}
		return nonce;
	}

	__Send ( type, uri, params={}, cb ){
		let url = this.__baseUrl + uri;
		let headers = Object.assign({}, this.headers);
		let body = '';

		if(type === 'get'){
			url += `?${stringify(params)}`;
		} else {
			body += JSON.stringify(params);
		}

		headers.ACCESS_NONCE =  this.__getNonce();
		headers.ACCESS_SIGNATURE = HmacSHA256(headers.ACCESS_NONCE + url + body, this.__apiSecret);

		request({
			method: type.toLowerCase(),
			headers,
			url,
			body
		}, (err, res, data) => {
			if(err || res.statusCode !== 200){
				return cb(err || new Error(res.headers.status), data);
			}

			try {
				let data = JSON.parse(data);
				if (data.success === false){
					err = new Error(data.errors || data.error);
				}
				cb(err, data);
			}catch(err) {
				cb(err || new Error(data.errors), data);
			}
		});
	}
}