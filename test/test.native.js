/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

// MODULES //

var resolve = require( 'path' ).resolve;
var tape = require( 'tape' );
var tryRequire = require( '@stdlib/utils-try-require' );
var isnan = require( '@stdlib/math-base-assert-is-nan' );
var abs = require( '@stdlib/math-base-special-abs' );
var EPS = require( '@stdlib/constants-float64-eps' );


// FIXTURES //

var data = require( './fixtures/julia/data.json' );


// VARIABLES //

var mean = tryRequire( resolve( __dirname, './../lib/native.js' ) );
var opts = {
	'skip': ( mean instanceof Error )
};


// TESTS //

tape( 'main export is a function', opts, function test( t ) {
	t.ok( true, __filename );
	t.strictEqual( typeof mean, 'function', 'main export is a function' );
	t.end();
});

tape( 'if provided `NaN` for `p`, the function returns `NaN`', opts, function test( t ) {
	var v;

	v = mean( 10, NaN );
	t.equal( isnan( v ), true, 'returns NaN' );

	t.end();
});

tape( 'if provided `n < 0` or success probability `p` outside of `[0,1]`, the function returns `NaN`', opts, function test( t ) {
	var v;

	v = mean( -1, 0.5 );
	t.equal( isnan( v ), true, 'returns NaN' );

	v = mean( 10, -0.1 );
	t.equal( isnan( v ), true, 'returns NaN' );

	v = mean( 10, 1.5 );
	t.equal( isnan( v ), true, 'returns NaN' );

	t.end();
});

tape( 'the function returns the mean of a binomial distribution', opts, function test( t ) {
	var expected;
	var delta;
	var tol;
	var i;
	var n;
	var p;
	var y;

	expected = data.expected;
	n = data.n;
	p = data.p;
	for ( i = 0; i < expected.length; i++ ) {
		y = mean( n[i], p[i] );
		if ( y === expected[i] ) {
			t.equal( y, expected[i], 'n: '+n[i]+', p: '+p[i]+', y: '+y+', expected: '+expected[i] );
		} else {
			delta = abs( y - expected[ i ] );
			tol = 1.0 * EPS * abs( expected[ i ] );
			t.ok( delta <= tol, 'within tolerance. n: '+n[i]+'. p: '+p[i]+'. y: '+y+'. E: '+expected[ i ]+'. Δ: '+delta+'. tol: '+tol+'.' );
		}
	}
	t.end();
});
