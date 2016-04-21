'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.coinbase = undefined;

var _cryptoJs = require('crypto-js');

var _microtime = require('microtime');

var microtime = _interopRequireWildcard(_microtime);

var _request = require('request');

var request = _interopRequireWildcard(_request);

var _querystring = require('querystring');

var _underscore = require('underscore');

var _ = _interopRequireWildcard(_underscore);

var _package = require('../package.json');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Example:
 * let coin  = new coinbase(KEY, SECRET);
 * coin.transactions.sendMoney({
 * 		
 * }, (err, data) => console.log(err, data) );
 *
 */

exports.default = coinbase;

var coinbase = exports.coinbase = function () {

	/**
  * @param  {String} APIKey              API Key
  * @param  {String} APISecret           API Secret
  * @param  {String} options.baseUrl     URL
  * @param  {String} options.contentType Content Type send
  */

	function coinbase(APIKey, APISecret, _ref) {
		var _this = this;

		var _ref$baseUrl = _ref.baseUrl;
		var baseUrl = _ref$baseUrl === undefined ? 'https://api.coinbase.com/v1/' : _ref$baseUrl;
		var _ref$contentType = _ref.contentType;
		var contentType = _ref$contentType === undefined ? 'application/json' : _ref$contentType;

		_classCallCheck(this, coinbase);

		this.counter = 0;
		this.last = '';
		this.headers = {
			'User-Agent': _package.name + '/' + _package.version
		};

		if (!APIKey || !APISecret) {
			throw new Error('Must provide an APIKey in order to interact with the coinbase api');
		}

		this.headers.ACCESS_KEY = APIKey;
		this.headers['content-type'] = contentType;

		this.__apiSecret = APISecret;
		this.__baseUrl = baseUrl;

		// Accounts
		/* GET /accounts */
		this.account = function (params, cb) {
			return _this.__Send('get', 'accounts', params, cb);
		};
		/* GET /accounts/:id */
		this.account.get = function (id, cb) {
			return _this.__Send('get', 'accounts/' + id, null, cb);
		};
		/* GET /account_changes */
		this.account.changes = function (params, cb) {
			return _this.__Send('get', 'account_changes', params, cb);
		};
		/* POST /accounts */
		this.account.create = function (params, cb) {
			return _this.__Send('post', 'accounts', params, cb);
		};
		/* PUT /accounts/:account_id */
		this.account.update = function (id, params, cb) {
			return _this.__Send('put', 'accounts/' + id, params, cb);
		};
		/* POST /accounts/:account_id/primary */
		this.account.primary = function (id, cb) {
			return _this.__Send('post', 'accounts/' + id, null, cb);
		};
		/* DELETE /accounts/:account_id */
		this.account.delete = function (id, cb) {
			return _this.__Send('delete', 'accounts/' + id, null, cb);
		};
		/* GET /accounts/:id/balance */
		this.account.balance = function (id, cb) {
			return _this.__Send('get', 'accounts/' + id + '/balance', null, cb);
		};
		/* GET /accounts/:id/address */
		this.account.address = function (id, cb) {
			return _this.__Send('get', 'accounts/' + id + '/address', null, cb);
		};
		/* POST /accounts/:account_id/addres */
		this.account.address.create = function (id, params, cb) {
			return _this.__Send('post', 'accounts/' + id + '/address', params, cb);
		};

		// Addresses
		/* GET /addresses */
		this.address = function (params, cb) {
			return _this.__Send('get', 'addresses', params, cb);
		};
		/* GET /addresses/:id_or_address */
		this.address.get = function (id, cb) {
			return _this.__Send('get', 'addresses/' + id, null, cb);
		};

		// Authorization
		/* GET /authorization */
		this.authorization = function (cb) {
			return _this.__Send('get', 'authorization', cb);
		};

		// Button
		/* POST /buttons */
		this.button = function (params, cb) {
			return _this.__Send('post', 'buttons', params, cb);
		};
		/* GET /buttons/:id */
		this.button.get = function (id, cb) {
			return _this.__Send('get', 'buttons/' + id, null, cb);
		};
		/* POST /buttons/:id/create_order */
		this.button.createOrder = function (id, cb) {
			return _this.__Send('post', 'buttons/' + id + '/create_order', null, cb);
		};
		/* GET /buttons/:id_or_custom_value/orders */
		this.button.orders = function (id, params, cb) {
			return _this.__Send('get', 'buttons/' + id + '/orders', params, cb);
		};

		// Buy
		/* POST /buys */
		this.buys = function (params, cb) {
			return _this.__Send('post', 'buys', params, cb);
		};

		// Contact
		/* GET /contacts */
		this.contacts = function (params, cb) {
			return _this.__Send('get', 'contacts', params, cb);
		};

		// Currencies
		/* GET /currencies */
		this.currencies = function (cb) {
			return _this.__Send('get', 'currencies', null, cb);
		};
		/* GET /currencies/exchange_rates */
		this.currencies.exchangeRates = function (cb) {
			return _this.__Send('get', 'currencies/exchange_rates', null, cb);
		};

		// multisig
		/* POST /accounts */
		this.multisig = function (params, cb) {
			return _this.__Send('post', 'accounts', params, cb);
		};
		/* POST /transactions/send_money */
		this.multisig.transactions = function (params, cb) {
			return _this.__Send('post', 'transactions/send_money', params, cb);
		};
		/* GET /transactions/:id/sighashes */
		this.multisig.sighashes = function (id, cb) {
			return _this.__Send('get', 'transactions/' + id + '/sighashes', null, cb);
		};
		/* PUT /transactions/:id/sighashes */
		this.multisig.signatures = function (id, params, cb) {
			return _this.__Send('put', 'transactions/' + id + '/sighashes', params, cb);
		};

		// Aplication
		/* GET /oauth/applications */
		this.app = function (params, cb) {
			return _this.__Send('get', 'oauth/applications', params, cb);
		};
		/* GET /oauth/applications/:id */
		this.app.get = function (id, cb) {
			return _this.__Send('get', 'oauth/applications/' + id, null, cb);
		};
		/* POST /oauth/applications */
		this.app.create = function (params, cb) {
			return _this.__Send('post', 'oauth/applications', params, cb);
		};

		// Order
		/* GET /orders */
		this.orders = function (cb) {
			return _this.__Send('get', 'orders', null, cb);
		};
		/* POST /orders */
		this.orders.create = function (params, cb) {
			return _this.__Send('post', 'orders', params, cb);
		};
		/* GET /orders/:id */
		this.orders.get = function (id, cb) {
			return _this.__Send('get', 'orders/' + id, null, cb);
		};
		/* POST /orders/:id */
		this.orders.refunds = function (id, params, cb) {
			return _this.__Send('get', 'orders/' + id, params, cb);
		};

		// Payment method
		/* GET /payment_methods */
		this.payment = function (name, cb) {
			if (_.isFunction(name)) {
				cb = name;
				name = '';
			}

			_this.__Send('get', 'payment_methods/' + name, null, cb);
		};
		/* GET /payment_methods/:id */
		this.payment.show = function (id, name, cb) {
			if (_.isFunction(name)) {
				cb = name;
				name = '';
			}

			_this.__Send('get', 'payment_methods/' + id + '/' + name, null, cb);
		};

		// Price
		/* GET /prices/buy */
		this.price = function (params, cb) {
			if (_.isFunction(params)) {
				cb = params;
				params = { qty: 1 };
			}

			_this.__Send('get', 'prices/buy', params, cb);
		};
		/* GET /prices/buy */
		this.price.sell = function (params, cb) {
			if (_.isFunction(params)) {
				cb = params;
				params = { qty: 1 };
			}

			_this.__Send('get', 'prices/sell', params, cb);
		};
		/* GET /prices/spot_rate */
		this.price.spotRate = function (params, cb) {
			return _this.__Send('get', 'prices/spot_rate', params, cb);
		};
		/* GET /prices/historical */
		this.price.historical = function (params, cb) {
			return _this.__Send('get', 'prices/historical', params, cb);
		};

		// Recurring payment
		/* GET /recurring_payments */
		this.recurringPayments = function (params, cb) {
			return _this.__Send('get', 'recurring_payments', params, cb);
		};
		/* GET /recurring_payments/:id */
		this.recurringPayments.get = function (id, cb) {
			return _this.__Send('get', 'recurring_payments/' + id, null, cb);
		};

		// Report
		/* GET /reports */
		this.reports = function (params, cb) {
			return _this.__Send('get', 'reports', params, cb);
		};
		/* GET /reports/:id */
		this.reports.get = function (id, cb) {
			return _this.__Send('get', 'reports/' + id, null, cb);
		};
		/* POST /reports */
		this.reports.create = function (params, cb) {
			return _this.__Send('post', 'reports', params, cb);
		};

		// Sel
		/* POST /sells */
		this.sell = function (params, cb) {
			return _this.__Send('post', 'sells', params, cb);
		};

		// Subscription
		/* GET /subscribers */
		this.subscribers = function (cb) {
			return _this.__Send('get', 'subscribers', cb);
		};
		/* GET /subscribers/:id */
		this.subscribers.get = function (id, cb) {
			return _this.__Send('get', 'subscribers/' + id, null, cb);
		};

		// Token
		/* GET /tokens */
		this.tokens = function (id, cb) {
			return _this.__Send('post', 'tokens', cb);
		};
		/* GET /tokens/redeem */
		this.tokens.redeem = function (params, cb) {
			return _this.__Send('post', 'tokens/redeem', params, cb);
		};

		// Transaction
		/* GET /transactions */
		this.transactions = function (params, cb) {
			return _this.__Send('get', 'transactions', params, cb);
		};
		/* GET /transactions/:id */
		this.transactions.get = function (id, cb) {
			return _this.__Send('get', 'transactions/' + id, null, cb);
		};
		/* POST /transactions/send_money */
		this.transactions.sendMoney = function (params, cb) {
			return _this.__Send('post', 'transactions/send_money', params, cb);
		};
		/* PUT /transactions/:id/resend_request */
		this.transactions.sendMoney.resend = function (id, cb) {
			return _this.__Send('put', 'transactions/' + id + '/resend_request', null, cb);
		};
		/* GET /transactions/transfer_money */
		this.transactions.transferMoney = function (params, cb) {
			return _this.__Send('post', 'transactions/transfer_money', params, cb);
		};
		/* PUT /transactions/:id/complete_request */
		this.transactions.transferMoney.complete = function (id, cb) {
			return _this.__Send('put', 'transactions/' + id + '/complete_request', cb);
		};
		/* GET /transactions/request_money */
		this.transactions.requestMoney = function (params, cb) {
			return _this.__Send('post', 'transactions/request_money', params, cb);
		};
		/* PUT /transactions/:id/complete_request */
		this.transactions.requestMoney.cancel = function (id, cb) {
			return _this.__Send('put', 'transactions/' + id + '/complete_request', null, cb);
		};

		// Transfer
		/* GET /transfers */
		this.transfers = function (params, cb) {
			return _this.__Send('get', 'transfers', params, cb);
		};
		/* GET /transfers/:id */
		this.transfers.get = function (id, cb) {
			return _this.__Send('get', 'transfers/' + id, null, cb);
		};
		/* POST /transfers/:id/commit */
		this.transfers.commit = function (id, cb) {
			return _this.__Send('post', 'transfers/' + id + '/commit', null, cb);
		};

		// USER
		/* POST /users/self */
		this.user = function (cb) {
			return _this.__Send('post', 'users/self', cb);
		};
		/* POST /users */
		this.user.create = function (params, cb) {
			return _this.__Send('post', 'users', params, cb);
		};
		/* POST /users/ */
		this.user.OAuth2 = function (params, cb) {
			return _this.__Send('post', 'users', params, cb);
		};
		/* PUT /users/:id */
		this.user.update = function (id, params, cb) {
			return _this.__Send('put', 'users/' + id, params, cb);
		};
	}

	coinbase.prototype.__getNonce = function __getNonce() {
		if (!this.counter) {
			this.counter = 0;
		}
		if (!this.last) {
			this.last = '';
		}

		this.counter++;
		var nonce = microtime.now() + '' + (100 + this.counter % 100);

		if (nonce < this.last) {
			nonce = this.__getNonce();
			this.last = nonce;
		}
		return nonce;
	};

	coinbase.prototype.__Send = function __Send(type, uri, params, cb) {
		var url = this.__baseUrl + uri,
			headers = _.clone(this.headers),
			body = '';

		if (type === 'get') {
			url += '?' + (0, _querystring.stringify)(params);
		} else {
			body += JSON.stringify(params);
		}

		headers.ACCESS_NONCE = __getNonce();
		headers.ACCESS_SIGNATURE = headers.ACCESS_NONCE + url + body;
		headers.ACCESS_SIGNATURE = (0, _cryptoJs.HmacSHA256)(headers.ACCESS_SIGNATURE, this.__apiSecret);

		request({
			method: type.toLowerCase(),
			headers: headers,
			url: url,
			body: body
		}, function (err, res, data) {
			if (err || res.statusCode !== 200) {
				return cb(err || new Error(res.headers.status), data);
			}

			try {
				data = JSON.parse(data);
				if (data.success === false) {
					err = new Error(data.errors || data.error);
				}
				cb(err, data);
			} catch (err) {
				cb(err || new Error(data.errors), data);
			}
		});
	};

	return coinbase;
}();

coinbase.VERSION = _package.version;
coinbase.NAME = _package.name;