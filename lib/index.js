const cryptoJS = require('crypto-js'),
	microtime = require('microtime'),
	request = require('request'),
	querystring = require('querystring'),
	util = require('util'),
	_ = require('underscore'),
	VERSION = require('../package.json').version;

// Internal
function CoinbaseError (error) {
	Error.captureStackTrace(this, CoinbaseError);
	this.error = error;
}

util.inherits(CoinbaseError, Error);

CoinbaseError.prototype.toString = function toString () {
	return 'CoinbaseError: ' + this.error;
};

// Public
function Coinbase (options) {
	if (!options || !options.APIKey)
		throw new CoinbaseError('Must provide an APIKey in order to interact with the coinbase api');

	this.__counter = 0;
	this.__last = '';
	this.__apiKey = options.APIKey;
	this.__apiSecret = options.APISecret;
	this.VERSION = VERSION;
	this.__baseUrl = 'https://api.coinbase.com/v1/'; // LAST
	this.__contentType = 'application/json';

	var self = this;

	// Account

	/* GET /accounts */
	this.account = function (params, callback) {
		self.__Send( 'get', 'accounts' , params, callback);
	};

	/* GET /accounts/:id */
	this.account.get = function (id, callback) {
		self.__Send( 'get', 'accounts/' + id, callback);
	};

	/* GET /account_changes */
	this.account.changes = function (params, callback) {
		self.__Send( 'get', 'account_changes', params, callback);
	};

	/* POST /accounts */
	this.account.create = function (params, callback) {
		self.__Send( 'post', 'accounts', params, callback);
	};

	/* PUT /accounts/:account_id */
	this.account.update = function (id, params, callback) {
		self.__Send( 'put', 'accounts/' + id, params, callback);
	};

	/* POST /accounts/:account_id/primary */
	this.account.primary = function (id, callback) {
		self.__Send( 'post', 'accounts/' + id, callback);
	};

	/* DELETE /accounts/:account_id */
	this.account.delete = function (id, callback) {
		self.__Send( 'delete', 'accounts/' + id , callback);
	};

	/* GET /accounts/:id/balance */
	this.account.balance = function (id, callback) {
		self.__Send( 'get', 'accounts/' + id + '/balance', callback);
	};

	/* GET /accounts/:id/address */
	this.account.address = function (id, callback) {
		self.__Send( 'get', 'accounts/' + id + '/address' , callback);
	};

	/* POST /accounts/:account_id/addres */
	this.account.address.create = function (id, params, callback) {
		self.__Send( 'post', 'acnew counts/' + id + '/address', params, callback);
	};

	// Addresses

	/* GET /addresses */
	this.address = function (params, callback) {
		self.__Send( 'get','addresses', params, callback);
	};

	/* GET /addresses/:id_or_address */
	this.address.get = function (id, callback) {
		self.__Send( 'get', 'addresses/' + id , callback);
	};

	// Authorization

	/* GET /authorization */
	this.authorization = function (callback) {
		self.__Send( 'get', 'authorization', callback);
	};

	// Buttons

	/* POST /buttons */
	this.button = function (params, callback) {
		self.__Send( 'post', 'buttons', params, callback);
	};

	/* GET /buttons/:id */
	this.button.get = function (id, callback) {
		self.__Send( 'get', 'buttons/' + id, callback);
	};

	/* POST /buttons/:id/create_order */
	this.button.createOrder = function (id, callback) {
		self.__Send( 'post', 'buttons/' + id + '/create_order', callback);
	};

	/* GET /buttons/:id_or_custom_value/orders */
	this.button.orders = function (id, params, callback) {
		self.__Send( 'get', 'buttons/' + id + '/orders', params, callback);
	};

	// Buys

	/* POST /buys */
	this.buys = function (params, callback) {
		self.__Send( 'post', 'buys', params, callback);
	};

	// Contacts

	/* GET /contacts */
	this.contacts = function (params, callback) {
		self.__Send( 'get', 'contacts', params, callback);
	};

	// Currencies

	/* GET /currencies */
	this.currencies = function ( callback) {
		self.__Send( 'get', 'currencies', callback);
	};

	/* GET /currencies/exchange_rates */
	this.currencies.exchangeRates = function ( callback) {
		self.__Send( 'get', 'currencies/exchange_rates', callback);
	};

	// multisig
	/* POST /accounts */
	this.multisig = function (params, callback) {
		self.__Send( 'post', 'accounts', params, callback);
	};

	/* POST /transactions/send_money */
	this.multisig.transactions = function (params, callback) {
		self.__Send( 'post', 'transactions/send_money', params, callback);
	};

	/* GET /transactions/:id/sighashes */
	this.multisig.sighashes = function (id, callback) {
		self.__Send( 'get', 'transactions/' + id +'/sighashes', callback);
	};

	/* PUT /transactions/:id/sighashes */
	this.multisig.signatures = function (id, params, callback) {
		self.__Send( 'put', 'transactions/' + id +'/sighashes', params, callback);
	};

	// Aplications

	/* GET /oauth/applications */
	this.app = function (params, callback) {
		self.__Send( 'get', 'oauth/applications', params, callback);
	};

	/* GET /oauth/applications/:id */
	this.app.get = function (id, callback) {
		self.__Send( 'get', 'oauth/applications/' + id , callback);
	};

	/* POST /oauth/applications */
	this.app.create = function (params, callback) {
		self.__Send( 'post', 'oauth/applications', params, callback);
	};

	// Orders

	/* GET /orders */
	this.orders = function ( callback) {
		self.__Send( 'get', 'orders' , callback);
	};

	/* POST /orders */
	this.orders.create = function (params, callback) {
		self.__Send( 'post', 'orders', params, callback);
	};

	/* GET /orders/:id */
	this.orders.get = function (id, callback) {
		self.__Send( 'get', 'orders/' + id, callback);
	};

	/* POST /orders/:id */
	this.orders.refunds = function (id, params, callback) {
		self.__Send( 'get', 'orders/' + id , params, callback);
	};

	// Payment methods

	/* GET /payment_methods */
	this.payment = function (name, callback) {
		if(_.isFunction(name)){
			callback = name;
			name = '';
		} else{
			if( !/^\//.test(name) )
				name = '/' + name;
		}
		self.__Send( 'get', 'payment_methods' + name, callback);
	};

	/* GET /payment_methods/:id */
	this.payment.show = function (id, name, callback) {
		if(_.isFunction(name)){
			callback = name;
			name = '';
		} else {
			name = '/' + name;
		}

		self.__Send( 'get', 'payment_methods/' + id + name, callback);
	};

	// Prices

	/* GET /prices/buy */
	this.price = function (params, callback) {
		if(_.isFunction(params)){
			callback = params;
			params = { qty : 1 };
		}

		self.__Send( 'get', 'prices/buy', params, callback);
	};

	/* GET /prices/buy */
	this.price.sell = function (params, callback) {
		if(_.isFunction(params)){
			callback = params;
			params = { qty : 1 };
		}

		self.__Send( 'get', 'prices/sell', params, callback);
	};

	/* GET /prices/spot_rate */
	this.price.spotRate = function (params, callback) {
		self.__Send( 'get', 'prices/spot_rate' , params, callback);
	};

	/* GET /prices/historical */
	this.price.historical = function (params, callback) {
		self.__Send( 'get', 'prices/historical' , params, callback);
	};

	// Recurring payments

	/* GET /recurring_payments */
	this.recurringPayments = function (params, callback) {
		self.__Send( 'get','recurring_payments', params, callback);
	};

	/* GET /recurring_payments/:id */
	this.recurringPayments.get = function (id, callback) {
		self.__Send( 'get', 'recurring_payments/' + id , callback);
	};

	// Reports

	/* GET /reports */
	this.reports = function (params, callback) {
		self.__Send( 'get', 'reports', params, callback);
	};

	/* GET /reports/:id */
	this.reports.get = function (id,  callback) {
		self.__Send( 'get', 'reports/' + id , callback);
	};

	/* POST /reports */
	this.reports.create = function (params, callback) {
		self.__Send( 'post', 'reports' , params, callback);
	};

	// Sell

	/* POST /sells */
	this.sell = function (params, callback) {
		self.__Send( 'post', 'sells', params, callback);
	};

	// Subscriptions

	/* GET /subscribers */
	this.subscribers = function (callback) {
		self.__Send( 'get', 'subscribers' , callback);
	};

	/* GET /subscribers/:id */
	this.subscribers.get = function (id, callback) {
		self.__Send( 'get', 'subscribers/'+ id , callback);
	};

	// Tokens

	/* GET /tokens */
	this.tokens = function (id, callback) {
		self.__Send( 'post', 'tokens', callback);
	};

	/* GET /tokens/redeem */
	this.tokens.redeem = function (params, callback) {
		self.__Send( 'post', 'tokens/redeem', params, callback);
	};

	// Transactions

	/* GET /transactions */
	this.transactions = function (params, callback) {
		self.__Send( 'get', 'transactions', params, callback);
	};

	/* GET /transactions/:id */
	this.transactions.get = function (id, callback) {
		self.__Send( 'get', 'transactions/' + id, callback);
	};

	/* POST /transactions/send_money */
	this.transactions.sendMoney = function (params, callback) {
		self.__Send( 'post','transactions/send_money' , params, callback);
	};

	/* PUT /transactions/:id/resend_request */
	this.transactions.sendMoney.resend = function (id, callback) {
		self.__Send( 'put', 'transactions/'+ id + '/resend_request', callback);
	};

	/* GET /transactions/transfer_money */
	this.transactions.transferMoney = function (params, callback) {
		self.__Send( 'post','transactions/transfer_money' , params, callback);
	};

	/* PUT /transactions/:id/complete_request */
	this.transactions.transferMoney.complete = function (id, callback) {
		self.__Send( 'put', 'transactions/'+ id + '/complete_request', callback);
	};

	/* GET /transactions/request_money */
	this.transactions.requestMoney = function (params, callback) {
		self.__Send( 'post','transactions/request_money' , params, callback);
	};

	/* PUT /transactions/:id/complete_request */
	this.transactions.requestMoney.cancel = function (id, callback) {
		self.__Send( 'put', 'transactions/'+ id + '/complete_request', callback);
	};

	// Transfers

	/* GET /transfers */
	this.transfers = function (params, callback) {
		self.__Send( 'get', 'transfers', params, callback);
	};

	/* GET /transfers/:id */
	this.transfers.get = function (id, callback) {
		self.__Send( 'get', 'transfers/' + id, callback);
	};

	/* POST /transfers/:id/commit */
	this.transfers.commit = function (id, callback) {
		self.__Send( 'post','transfers/' + id + '/commit' , callback);
	};

	// USERS

	/* POST /users/self */
	this.user = function (callback) {
		self.__Send( 'post','users/self' , callback);
	};

	/* POST /users */
	this.user.create = function (params, callback) {
		self.__Send( 'post', 'users', params, callback);
	};

	/* POST /users/ */
	this.user.OAuth2 = function (params, callback) {
		self.__Send( 'post', 'users', params, callback);
	};

	/* PUT /users/:id */
	this.user.update = function (id, params, callback) {
		self.__Send( 'put', 'users/' + id, params, callback);
	};
}

Coinbase.prototype.__Send = function ( type, uri, params, callback ){
	if(_.isFunction(params)){
		callback = params;
		params = {};
	}
	var reqObject = {
		method: type.toLowerCase(),
		headers: {
			'ACCESS_KEY': this.__apiKey,
			'ACCESS_NONCE': this.__getNonce(),
			'User-Agent': 'coinbase-service/' + this.VERSION
		},
		url : this.__baseUrl + uri,
		body : ''
	};
	if(!_.isEmpty(params)){
		if(reqObject.method === 'GET'){
			reqObject.url += '?' + querystring.stringify(params);
		} else {
			reqObject.headers['content-type'] = this.__contentType;
			reqObject.body = JSON.stringify(params);
		}
	}
	
	reqObject.headers.ACCESS_SIGNATURE = reqObject.headers.ACCESS_NONCE + reqObject.url + reqObject.body;
	reqObject.headers.ACCESS_SIGNATURE = cryptoJS.HmacSHA256(reqObject.headers.ACCESS_SIGNATURE, this.__apiSecret);

	request(reqObject, function (err, res, data) {
		if(err)
			return callback(err, data);
		if( res.statusCode !== 200 )
			return callback(new CoinbaseError(res.headers.status));
		try {
			data = JSON.parse(data);
			if (data.success === false)
				err = new CoinbaseError(data.errors || data.error);
			callback(err, data);
		}catch(err) {
			callback(err || new CoinbaseError(data.errors), data);
		}
	});
};

// Internal
Coinbase.prototype.__getNonce = function () {
	if(!this.counter) this.__counter = 0;
	if(!this.last) this.__last = '';
	this.__counter++;
	var nonce = microtime.now() + '' + (100 + this.__counter % 100);
	if (nonce < this.__last) {
		nonce = this.__getNonce();
		this.__last = nonce;
	}
	return nonce;
};
Coinbase.VERSION = VERSION;
module.exports = Coinbase;
