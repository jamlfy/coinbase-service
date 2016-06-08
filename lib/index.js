'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.coinbase = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _package = require('../package.json');

var _cryptoJs = require('crypto-js');

var _querystring = require('querystring');

var _microtime = require('microtime');

var _microtime2 = _interopRequireDefault(_microtime);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  */

	function coinbase(APIKey, APISecret) {
		var _this = this;

		var baseUrl = arguments.length <= 2 || arguments[2] === undefined ? 'https://api.coinbase.com/v1/' : arguments[2];

		_classCallCheck(this, coinbase);

		if (!APIKey || !APISecret) {
			throw new Error('Must provide an APIKey in order to interact with the coinbase api');
		}

		this.counter = 0;
		this.last = '';
		this.headers = {
			'User-Agent': _package.name + '/' + _package.version,
			'content-type': 'application/json',
			'ACCESS_KEY': APIKey
		};

		this.__apiSecret = APISecret;
		this.__baseUrl = baseUrl;

		// Accounts
		/* GET /accounts */
		this.account = function (obj, cb) {
			return _this.__Send('get', 'accounts', obj, cb);
		};
		/* GET /accounts/:id */
		this.account.get = function (id, cb) {
			return _this.__Send('get', 'accounts/' + id, null, cb);
		};
		/* GET /account_changes */
		this.account.changes = function (obj, cb) {
			return _this.__Send('get', 'account_changes', obj, cb);
		};
		/* POST /accounts */
		this.account.create = function (obj, cb) {
			return _this.__Send('post', 'accounts', obj, cb);
		};
		/* PUT /accounts/:account_id */
		this.account.update = function (id, obj, cb) {
			return _this.__Send('put', 'accounts/' + id, obj, cb);
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
		this.account.address.create = function (id, obj, cb) {
			return _this.__Send('post', 'accounts/' + id + '/address', obj, cb);
		};

		// Addresses
		/* GET /addresses */
		this.address = function (obj, cb) {
			return _this.__Send('get', 'addresses', obj, cb);
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
		this.button = function (obj, cb) {
			return _this.__Send('post', 'buttons', obj, cb);
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
		this.button.orders = function (id, obj, cb) {
			return _this.__Send('get', 'buttons/' + id + '/orders', obj, cb);
		};

		// Buy
		/* POST /buys */
		this.buys = function (obj, cb) {
			return _this.__Send('post', 'buys', obj, cb);
		};

		// Contact
		/* GET /contacts */
		this.contacts = function (obj, cb) {
			return _this.__Send('get', 'contacts', obj, cb);
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
		this.multisig = function (obj, cb) {
			return _this.__Send('post', 'accounts', obj, cb);
		};
		/* POST /transactions/send_money */
		this.multisig.transactions = function (obj, cb) {
			return _this.__Send('post', 'transactions/send_money', obj, cb);
		};
		/* GET /transactions/:id/sighashes */
		this.multisig.sighashes = function (id, cb) {
			return _this.__Send('get', 'transactions/' + id + '/sighashes', null, cb);
		};
		/* PUT /transactions/:id/sighashes */
		this.multisig.signatures = function (id, obj, cb) {
			return _this.__Send('put', 'transactions/' + id + '/sighashes', obj, cb);
		};

		// Aplication
		/* GET /oauth/applications */
		this.app = function (obj, cb) {
			return _this.__Send('get', 'oauth/applications', obj, cb);
		};
		/* GET /oauth/applications/:id */
		this.app.get = function (id, cb) {
			return _this.__Send('get', 'oauth/applications/' + id, null, cb);
		};
		/* POST /oauth/applications */
		this.app.create = function (obj, cb) {
			return _this.__Send('post', 'oauth/applications', obj, cb);
		};

		// Order
		/* GET /orders */
		this.orders = function (cb) {
			return _this.__Send('get', 'orders', null, cb);
		};
		/* POST /orders */
		this.orders.create = function (obj, cb) {
			return _this.__Send('post', 'orders', obj, cb);
		};
		/* GET /orders/:id */
		this.orders.get = function (id, cb) {
			return _this.__Send('get', 'orders/' + id, null, cb);
		};
		/* POST /orders/:id */
		this.orders.refunds = function (id, obj, cb) {
			return _this.__Send('get', 'orders/' + id, obj, cb);
		};

		// Payment method
		/* GET /payment_methods */
		this.payment = function (name, cb) {
			if (typeof name === 'function') {
				cb = name;
				name = '';
			}

			return _this.__Send('get', 'payment_methods/' + name, null, cb);
		};
		/* GET /payment_methods/:id */
		this.payment.show = function (id, name, cb) {
			if (typeof name === 'function') {
				cb = name;
				name = '';
			}

			return _this.__Send('get', 'payment_methods/' + id + '/' + name, null, cb);
		};

		// Price
		/* GET /prices/buy */
		this.price = function (obj, cb) {
			if (typeof obj === 'function') {
				cb = obj;
				obj = { qty: 1 };
			}

			return _this.__Send('get', 'prices/buy', obj, cb);
		};
		/* GET /prices/buy */
		this.price.sell = function (obj, cb) {
			if (typeof obj === 'function') {
				cb = obj;
				obj = { qty: 1 };
			}

			return _this.__Send('get', 'prices/sell', obj, cb);
		};
		/* GET /prices/spot_rate */
		this.price.spotRate = function (obj, cb) {
			return _this.__Send('get', 'prices/spot_rate', obj, cb);
		};
		/* GET /prices/historical */
		this.price.historical = function (obj, cb) {
			return _this.__Send('get', 'prices/historical', obj, cb);
		};

		// Recurring payment
		/* GET /recurring_payments */
		this.recurringPayments = function (obj, cb) {
			return _this.__Send('get', 'recurring_payments', obj, cb);
		};
		/* GET /recurring_payments/:id */
		this.recurringPayments.get = function (id, cb) {
			return _this.__Send('get', 'recurring_payments/' + id, null, cb);
		};

		// Report
		/* GET /reports */
		this.reports = function (obj, cb) {
			return _this.__Send('get', 'reports', obj, cb);
		};
		/* GET /reports/:id */
		this.reports.get = function (id, cb) {
			return _this.__Send('get', 'reports/' + id, null, cb);
		};
		/* POST /reports */
		this.reports.create = function (obj, cb) {
			return _this.__Send('post', 'reports', obj, cb);
		};

		// Sel
		/* POST /sells */
		this.sell = function (obj, cb) {
			return _this.__Send('post', 'sells', obj, cb);
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
		this.tokens.redeem = function (obj, cb) {
			return _this.__Send('post', 'tokens/redeem', obj, cb);
		};

		// Transaction
		/* GET /transactions */
		this.transactions = function (obj, cb) {
			return _this.__Send('get', 'transactions', obj, cb);
		};
		/* GET /transactions/:id */
		this.transactions.get = function (id, cb) {
			return _this.__Send('get', 'transactions/' + id, null, cb);
		};
		/* POST /transactions/send_money */
		this.transactions.sendMoney = function (obj, cb) {
			return _this.__Send('post', 'transactions/send_money', obj, cb);
		};
		/* PUT /transactions/:id/resend_request */
		this.transactions.sendMoney.resend = function (id, cb) {
			return _this.__Send('put', 'transactions/' + id + '/resend_request', null, cb);
		};
		/* GET /transactions/transfer_money */
		this.transactions.transferMoney = function (obj, cb) {
			return _this.__Send('post', 'transactions/transfer_money', obj, cb);
		};
		/* PUT /transactions/:id/complete_request */
		this.transactions.transferMoney.complete = function (id, cb) {
			return _this.__Send('put', 'transactions/' + id + '/complete_request', cb);
		};
		/* GET /transactions/request_money */
		this.transactions.requestMoney = function (obj, cb) {
			return _this.__Send('post', 'transactions/request_money', obj, cb);
		};
		/* PUT /transactions/:id/complete_request */
		this.transactions.requestMoney.cancel = function (id, cb) {
			return _this.__Send('put', 'transactions/' + id + '/complete_request', null, cb);
		};

		// Transfer
		/* GET /transfers */
		this.transfers = function (obj, cb) {
			return _this.__Send('get', 'transfers', obj, cb);
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
		this.user.create = function (obj, cb) {
			return _this.__Send('post', 'users', obj, cb);
		};
		/* POST /users/ */
		this.user.OAuth2 = function (obj, cb) {
			return _this.__Send('post', 'users', obj, cb);
		};
		/* PUT /users/:id */
		this.user.update = function (id, obj, cb) {
			return _this.__Send('put', 'users/' + id, obj, cb);
		};
	}

	_createClass(coinbase, [{
		key: '__getNonce',
		value: function __getNonce() {
			if (!this.counter) {
				this.counter = 0;
			}
			if (!this.last) {
				this.last = '';
			}

			this.counter++;
			var nonce = _microtime2.default.now() + '' + (100 + this.counter % 100);

			if (nonce < this.last) {
				nonce = this.__getNonce();
				this.last = nonce;
			}
			return nonce;
		}
	}, {
		key: '__Send',
		value: function __Send(type, uri) {
			var params = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
			var cb = arguments[3];

			var url = this.__baseUrl + uri;
			var headers = Object.assign({}, this.headers);
			var body = '';

			if (type === 'get') {
				url += '?' + (0, _querystring.stringify)(params);
			} else {
				body += JSON.stringify(params);
			}

			headers.ACCESS_NONCE = this.__getNonce();
			headers.ACCESS_SIGNATURE = (0, _cryptoJs.HmacSHA256)(headers.ACCESS_NONCE + url + body, this.__apiSecret);

			(0, _request2.default)({
				method: type.toLowerCase(),
				headers: headers,
				url: url,
				body: body
			}, function (err, res, data) {
				if (err || res.statusCode !== 200) {
					return cb(err || new Error(res.headers.status), data);
				}

				try {
					var _data = JSON.parse(_data);
					if (_data.success === false) {
						err = new Error(_data.errors || _data.error);
					}
					cb(err, _data);
				} catch (err) {
					cb(err || new Error(data.errors), data);
				}
			});
		}
	}]);

	return coinbase;
}();