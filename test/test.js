require('should');
var Huobi = require('../index.js');

var huobi = new Huobi(process.env.API_KEY, process.env.API_SECRET);

describe('huobi', function() {
	this.timeout(4000);

	it('should return account info', function(done) {
		huobi.getAccountInfo(function(data, err) {
			if (err) return done(err);
			data.should.have.property('available_btc_display');
			done();
		});
	});

	it('should return order', function(done) {
		huobi.buy(1, 10, 0.1, function(data, err) {
			if (err) return done(err);
			data.should.have.property('id');

			huobi.cancelOrder(1, data['id'], function(data, err) {
				data.should.have.property('result');
				done();
			});
		});
	});

	it('should return error code 66: Invalid access key', function(done) {
		var key = huobi.key;

		huobi.key = 'foo';
		huobi.getAccountInfo(function(data, err) {
			if (err) return done(err);
			data.should.have.property('code', 66);
			done();
		});

		huobi.key = key;
	});
});
