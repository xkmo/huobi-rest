var request = require('request');
var md5 = require('MD5');

function Huobi(key, secret) {
	this.key = key;
	this.secret = secret;
}

Huobi.prototype._request = function(params, callback) {
	params['access_key'] = this.key;
	params['created'] = Math.floor(Date.now() / 1000); // in seconds
	params['sign'] = sign(params, this.secret);

	var options = {
		url: 'https://api.huobi.com/apiv2.php',
		form: params
	};

	request.post(options, function(error, response, body) {
		var data = JSON.parse(body);
		if (data['code']) {
			data['errormessage'] = errorMessage(data['code']);
		}

		callback(data, error);
	});
};

Huobi.prototype.getAccountInfo = function(callback) {
	var params = {
		method: 'get_account_info'
	};

	this._request(params, callback);
};

Huobi.prototype.getOrders = function(coinType, callback) {
	var params = {
		method: 'get_orders',
		coin_type: coinType
	};

	this._request(params, callback);
};

Huobi.prototype.orderInfo = function(coinType, id, callback) {
	var params = {
		method: 'order_info',
		coin_type: coinType,
		id: id
	};

	this._request(params, callback);
};

Huobi.prototype.buy = function(coinType, price, amount, callback) {
	var params = {
		method: 'buy',
		coin_type: coinType,
		price: price,
		amount: amount
	};

	this._request(params, callback);
};

Huobi.prototype.sell = function(coinType, price, amount, callback) {
	var params = {
		method: 'sell',
		coin_type: coinType,
		price: price,
		amount: amount
	};

	this._request(params, callback);
};

Huobi.prototype.buyMarket = function(coinType, amount, callback) {
	var params = {
		method: 'buy_market',
		coin_type: coinType,
		amount: amount
	};

	this._request(params, callback);
};

Huobi.prototype.sellMarket = function(coinType, amount, callback) {
	var params = {
		method: 'buy_market',
		coin_type: coinType,
		amount: amount
	};

	this._request(params, callback);
};

Huobi.prototype.cancelOrder = function(coinType, id, callback) {
	var params = {
		method: 'cancel_order',
		coin_type: coinType,
		id: id
	};

	this._request(params, callback);
};

Huobi.prototype.modifyOrder = function(coinType, id, price, amount, callback) {
	var params = {
		method: 'modify_order',
		coin_type: coinType,
		id: id,
		price: price,
		amount: amount
	};

	this._request(params, callback);
};

Huobi.prototype.getNewDealOrders = function(coinType, callback) {
	var params = {
		method: 'get_new_deal_orders',
		coin_type: coinType,
	};

	this._request(params, callback);
};

Huobi.prototype.getOrderIdByTradeId = function(coinType, tradeId, callback) {
	var params = {
		method: 'get_order_id_by_trade_id',
		coin_type: coinType,
		trade_id: tradeId
	};

	this._request(params, callback);
};

function sign(params, secret) {
	return md5(stringifyForSign(params) + '&secret_key='+ secret).toLowerCase();
}

function stringifyForSign(obj) {
	var arr = [],
	i,
	formattedObject = '';

	for (i in obj) {
		if (obj.hasOwnProperty(i)) {
			arr.push(i);
		}
	}
	arr.sort();
	for (i = 0; i < arr.length; i++) {
		if (i != 0) {
			formattedObject += '&';
		}
		formattedObject += arr[i] + '=' + obj[arr[i]];
	}
	return formattedObject;
}

function errorMessage(code) {
	var codes = {
		1:  'Server error',
		2:  'Not enough CNY',
		3:  'Restart failed',
		4:  'Trade over',
		10: 'Not enough BTC',
		11:	'Not enough LTC',
		18:	'Incorrect payment password',
		26:	'Order is not exist',
		41:	'Filled order, unable to modify',
		42:	'Order has been cancelled, unable to modify',
		44:	'Price is too low',
		45:	'Price is too high',
		46:	'Minimum amount is 0.001',
		47:	'Exceed the limit amount',
		55:	'10% higher than market price is not allowed',
		56:	'10% lower than market price is not allowed',
		64:	'Invalid request',
		65:	'Invalid method',
		66:	'Invalid access key',
		67:	'Invalid private key',
		68:	'Invalid price',
		69:	'Invalid amount',
		70:	'Invalid POST time',
		71:	'Overflowed requests',
		87:	'Buying price cannot exceed 1% of market price when transaction amount is less than 0.1 BTC.',
		88:	'Selling price cannot be lower 1% of market price when transaction amount is less than 0.1 BTC.',
		89:	'Buying price cannot exceed 1% of market price when transaction amount is less than 0.1 BTC.',
		90:	'Selling price cannot be lower 1% of market price when transaction amount is less than 0.1 BTC.',
		91:	'Invalid type',
		92:	'Buy price cannot be higher 10% than market price.',
		93:	'Sell price cannot be lower 10% than market price.',
		97:	'Please enter payment password.',
		107:'Order is exist.'
	}
	if (!codes[code]) {
		return 'Huobi error code: ' + code + 'is not supported';
	}

	return codes[code];
}

module.exports = Huobi;
