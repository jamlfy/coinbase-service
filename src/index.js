import {HmacSHA256} from 'crypto-js'; 
import * as microtime from 'microtime'; 
import * as request from 'request'; 
import {stringify} from 'querystring'; 
import * as _ from 'underscore'; 
import {version, name} from '../package.json';

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

	counter = 0;
	last = '';
	headers = {
		'User-Agent': `${name}/${version}`
	};

	static VERSION = version;
	static NAME = name;

	/**
	 * @param  {String} APIKey              API Key
	 * @param  {String} APISecret           API Secret
	 * @param  {String} options.baseUrl     URL
	 * @param  {String} options.contentType Content Type send
	 */
	constructor(APIKey, APISecret,{
		baseUrl = 'https://api.coinbase.com/v1/',
		contentType ='application/json',
	}) {
		if (!APIKey || !APISecret ){
			throw new Error('Must provide an APIKey in order to interact with the coinbase api');	
		}

		this.headers.ACCESS_KEY = APIKey;
		this.headers['content-type'] = contentType;

		this.__apiSecret = APISecret;
		this.__baseUrl = baseUrl;

		// Accounts
		/* GET /accounts */
		this.account = (params, cb) => this.__Send('get', `accounts`, params, cb);
		/* GET /accounts/:id */
		this.account.get = (id, cb) => this.__Send('get', `accounts/${id}`, null, cb);
		/* GET /account_changes */
		this.account.changes = (params, cb) => this.__Send('get', 'account_changes', params, cb);
		/* POST /accounts */
		this.account.create = (params, cb) => this.__Send('post', 'accounts', params, cb);
		/* PUT /accounts/:account_id */
		this.account.update = (id, params, cb) => this.__Send('put', `accounts/${id}`, params, cb);
		/* POST /accounts/:account_id/primary */
		this.account.primary = (id, cb) => this.__Send('post', `accounts/${id}`, null, cb);
		/* DELETE /accounts/:account_id */
		this.account.delete = (id, cb) => this.__Send( 'delete', `accounts/${id}`, null, cb);
		/* GET /accounts/:id/balance */
		this.account.balance = (id, cb) => this.__Send('get', `accounts/${id}/balance`, null, cb);
		/* GET /accounts/:id/address */
		this.account.address = (id, cb) => this.__Send('get', `accounts/${id}/address`, null, cb);
		/* POST /accounts/:account_id/addres */
		this.account.address.create = (id, params, cb) => this.__Send('post', `accounts/${id}/address`, params, cb);

		// Addresses
		/* GET /addresses */
		this.address = (params, cb) => this.__Send('get','addresses', params, cb);
		/* GET /addresses/:id_or_address */
		this.address.get = (id, cb) => this.__Send('get', `addresses/${id}`, null, cb);

		// Authorization
		/* GET /authorization */
		this.authorization = (cb) => this.__Send('get', 'authorization', cb);

		// Button
		/* POST /buttons */
		this.button = (params, cb) => this.__Send('post', 'buttons', params, cb);
		/* GET /buttons/:id */
		this.button.get = (id, cb) => this.__Send('get', `buttons/${id}`, null, cb);
		/* POST /buttons/:id/create_order */
		this.button.createOrder = (id, cb) => this.__Send('post', `buttons/${id}/create_order`, null, cb);
		/* GET /buttons/:id_or_custom_value/orders */
		this.button.orders = (id, params, cb) => this.__Send('get', `buttons/${id}/orders`, params, cb);


		// Buy
		/* POST /buys */
		this.buys = (params, cb) => this.__Send('post', 'buys', params, cb);

		// Contact
		/* GET /contacts */
		this.contacts = (params, cb) => this.__Send('get', 'contacts', params, cb);

		// Currencies
		/* GET /currencies */
		this.currencies = ( cb) => this.__Send('get', 'currencies', null, cb);
		/* GET /currencies/exchange_rates */
		this.currencies.exchangeRates = ( cb) => this.__Send('get', 'currencies/exchange_rates', null, cb);

		// multisig
		/* POST /accounts */
		this.multisig = (params, cb) => this.__Send('post', 'accounts', params, cb);
		/* POST /transactions/send_money */
		this.multisig.transactions = (params, cb) => this.__Send('post', 'transactions/send_money', params, cb);
		/* GET /transactions/:id/sighashes */
		this.multisig.sighashes = (id, cb) => this.__Send('get', `transactions/${id}/sighashes`, null, cb);
		/* PUT /transactions/:id/sighashes */
		this.multisig.signatures = (id, params, cb) => this.__Send('put', `transactions/${id}/sighashes`, params, cb);

		// Aplication
		/* GET /oauth/applications */
		this.app = (params, cb) => this.__Send('get', 'oauth/applications', params, cb);
		/* GET /oauth/applications/:id */
		this.app.get = (id, cb) => this.__Send('get', `oauth/applications/${id}`, null, cb);
		/* POST /oauth/applications */
		this.app.create = (params, cb) => this.__Send('post', 'oauth/applications', params, cb);

		// Order
		/* GET /orders */
		this.orders = (cb) => this.__Send('get', 'orders', null, cb);
		/* POST /orders */
		this.orders.create = (params, cb) => this.__Send('post', 'orders', params, cb);
		/* GET /orders/:id */
		this.orders.get = (id, cb) => this.__Send('get', `orders/${id}`, null, cb);
		/* POST /orders/:id */
		this.orders.refunds = (id, params, cb) => this.__Send('get', `orders/${id}`, params, cb);

		// Payment method
		/* GET /payment_methods */
		this.payment = (name, cb) => {
			if(_.isFunction(name)){
				cb = name;
				name = '';
			}

			this.__Send('get', `payment_methods/${name}`, null, cb);
		};
		/* GET /payment_methods/:id */
		this.payment.show = (id, name, cb) => {
			if(_.isFunction(name)){
				cb = name;
				name = '';
			}

			this.__Send('get', `payment_methods/${id}/${name}`, null, cb);
		};

		// Price
		/* GET /prices/buy */
		this.price = (params, cb) => {
			if(_.isFunction(params)){
				cb = params;
				params = { qty : 1 };
			}

			this.__Send('get', 'prices/buy', params, cb);
		};
		/* GET /prices/buy */
		this.price.sell = (params, cb) => {
			if(_.isFunction(params)){
				cb = params;
				params = { qty : 1 };
			}

			this.__Send('get', 'prices/sell', params, cb);
		};
		/* GET /prices/spot_rate */
		this.price.spotRate = (params, cb) => this.__Send('get', 'prices/spot_rate', params, cb);
		/* GET /prices/historical */
		this.price.historical = (params, cb) => this.__Send('get', 'prices/historical', params, cb);

		// Recurring payment
		/* GET /recurring_payments */
		this.recurringPayments = (params, cb) => this.__Send('get','recurring_payments', params, cb);
		/* GET /recurring_payments/:id */
		this.recurringPayments.get = (id, cb) => this.__Send('get', `recurring_payments/${id}`, null, cb);

		// Report
		/* GET /reports */
		this.reports = (params, cb) => this.__Send('get', 'reports', params, cb);
		/* GET /reports/:id */
		this.reports.get = (id,  cb) => this.__Send('get', `reports/${id}`, null, cb);
		/* POST /reports */
		this.reports.create = (params, cb) => this.__Send('post', 'reports' , params, cb);


		// Sel
		/* POST /sells */
		this.sell = (params, cb) => this.__Send('post', 'sells', params, cb);

		// Subscription
		/* GET /subscribers */
		this.subscribers = (cb) => this.__Send('get', 'subscribers', cb);
		/* GET /subscribers/:id */
		this.subscribers.get = (id, cb) => this.__Send('get', `subscribers/${id}`, null, cb);

		// Token
		/* GET /tokens */
		this.tokens = (id, cb) => this.__Send('post', 'tokens', cb);
		/* GET /tokens/redeem */
		this.tokens.redeem = (params, cb) => this.__Send('post', 'tokens/redeem', params, cb);

		// Transaction
		/* GET /transactions */
		this.transactions = (params, cb) => this.__Send('get', 'transactions', params, cb);
		/* GET /transactions/:id */
		this.transactions.get = (id, cb) => this.__Send('get', `transactions/${id}`, null, cb);
		/* POST /transactions/send_money */
		this.transactions.sendMoney = (params, cb) => this.__Send('post','transactions/send_money', params, cb);
		/* PUT /transactions/:id/resend_request */
		this.transactions.sendMoney.resend = (id, cb) => this.__Send('put', `transactions/${id}/resend_request`, null, cb);
		/* GET /transactions/transfer_money */
		this.transactions.transferMoney = (params, cb) => this.__Send('post','transactions/transfer_money', params, cb);
		/* PUT /transactions/:id/complete_request */
		this.transactions.transferMoney.complete = (id, cb) => this.__Send('put', `transactions/${id}/complete_request`, cb);
		/* GET /transactions/request_money */
		this.transactions.requestMoney = (params, cb) => this.__Send('post','transactions/request_money', params, cb);
		/* PUT /transactions/:id/complete_request */
		this.transactions.requestMoney.cancel = (id, cb) => this.__Send('put', `transactions/${id}/complete_request`, null, cb);

		// Transfer
		/* GET /transfers */
		this.transfers = (params, cb) => this.__Send('get', 'transfers', params, cb);
		/* GET /transfers/:id */
		this.transfers.get = (id, cb) => this.__Send('get', `transfers/${id}`, null, cb);
		/* POST /transfers/:id/commit */
		this.transfers.commit = (id, cb) => this.__Send('post',`transfers/${id}/commit`, null, cb);

		// USER
		/* POST /users/self */
		this.user = (cb) => this.__Send('post','users/self', cb);
		/* POST /users */
		this.user.create = (params, cb) => this.__Send('post', 'users', params, cb);
		/* POST /users/ */
		this.user.OAuth2 = (params, cb) => this.__Send('post', 'users', params, cb);
		/* PUT /users/:id */
		this.user.update = (id, params, cb) => this.__Send('put', `users/${id}`, params, cb);

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

	__Send ( type, uri, params, cb ){
		let url = this.__baseUrl + uri,
			headers = _.clone(this.headers),
			body = '';

		if(type === 'get'){
			url += `?${stringify(params)}`;
		} else {
			body += JSON.stringify(params);
		}

		headers.ACCESS_NONCE =  __getNonce();
		headers.ACCESS_SIGNATURE = headers.ACCESS_NONCE + url + body;
		headers.ACCESS_SIGNATURE = HmacSHA256(headers.ACCESS_SIGNATURE, this.__apiSecret);

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
				data = JSON.parse(data);
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