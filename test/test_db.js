
var expect = require("chai").expect;
var assert = require('chai').assert;


var logger = require('../lib/logger.js').logger;
var db = require("../lib/db.js")('development', logger);
var util = require('../lib/util.js');

var argless = function(f) {return function() {f();};};

describe("db", function() {

	describe(".getTileData()", function() {

		it("should get tile data for known co-ordinates", function(done) {

			var box = util.getLTRBbox(15, 17072, 11452);

			db.getTileData(box.left, box.top, box.right, box.bottom)
				.then(function (result) {
					console.log(result);
					expect(result.length).to.be.above(0);
				})
				.then(argless(done));

		});

  });

	describe("test", function () {

		it("should get raw data", function (done) {

			db.db.one("select * from ch_2po_4pgr limit 1")
			  .then(function(data){
		      console.log(data);
			  })
				.then(argless(done));

		});

	});

}); // end db
