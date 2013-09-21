/* Copyright (c) 2012 Jamie Barnes
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

if (this.WScript !== undefined && WScript.Echo !== undefined) {
    WScript.Echo('-FAILED: Must be run from within the NodeJS engine, node.exe');
}
else { 
    var Utils = require('util');
    var Wmi = require('./index.js');
    var WmiDate = Wmi.WmiDate;

    var testDates = [
        new WmiDate(),
        new WmiDate( new Date() ),
        new WmiDate( 2011, 1, 10 ),
        new WmiDate( 2011, 8, 10 ),
        new WmiDate( 2012, 2, 20, 13, 57, 31, 357 ),
        new WmiDate( 2013, 3, 30, 1, 2, 3, 456789, -60 ),
        new WmiDate( NaN, 3, NaN, 1, NaN, 3, NaN, -60 ),
        new WmiDate( 2013, NaN, 30, NaN, 2, NaN, 456789, NaN ),
        new WmiDate( '2014-04-01T07:08:09.123Z' ),
        new WmiDate( '2015-05-02T01:02:03.456+0100' ),
        new WmiDate( 'arse' ),
        new WmiDate( NaN ),
    ];
    var testWMIStrings = [
        '20120304050607.890123+000',
        '20120304050607.890+060',
        '',
        '20120304050607.890123+***',
        '****03**05**07.890123+***',
        'arse',
        '99992020******.******+***',
        '99992020******.***+***',
    ];
    for (var d = 0, dlen = testDates.length; d < dlen; d++) {
        var wmiDate = testDates[d];
        console.log(Utils.inspect(wmiDate));
        for (var p in wmiDate) if (wmiDate.hasOwnProperty(p) && wmiDate[p].constructor === Function) {
            console.log('wmiDate.' + p + '() => ' + wmiDate[p]());
        }
        console.log('End of dates test #' + d);
        console.log('-----------------------------------------------------------------------------');
    }
    for (var w = 0, wlen = testWMIStrings.length; w < wlen; w++) {
        var wmiDate = WmiDate.fromWMIString(testWMIStrings[w]);
        console.log(Utils.inspect(wmiDate));
        for (var p in wmiDate) if (wmiDate.hasOwnProperty(p) && wmiDate[p].constructor === Function) {
            console.log('wmiDate.' + p + '() => ' + wmiDate[p]());
        }
        console.log('End of strings test #' + w);
        console.log('-----------------------------------------------------------------------------');
    }

    var ii = setInterval(function() { console.log('ping......................................................'); }, 5000);

    Wmi.connect(function(err, wmi) {
        if (err !== null) console.log(err);
        
        wmi.on('parserError', function(err) {
            console.log('received parserError: ' + Utils.inspect(err));
        });
        
        wmi.query('SELECT * FROM Win32_OperatingSystem', function(err, results) { 
            console.log('query#1 callback');
            console.log('err = ' + Utils.inspect(err));
            console.log('results = ' + Utils.inspect(results));
            if (results !== undefined && results !== null && results.constructor === Array) {
                for (var i = 0, ilen = results.length; i < ilen; i++) {
                    console.log(['[', i, '] => WindowsDirectory = ', results[i].WindowsDirectory].join(''));
                    
                    for (var p in results[i]) if (results[i].hasOwnProperty(p) && results[i][p] !== null && results[i][p].constructor === WmiDate) {
                        console.log(['[', i, '] => ' + p + ' = ', results[i][p]].join(''));
                        console.log(['[', i, '] => ' + p + ' = ', results[i][p].toJavaScriptDate()].join(''));
                        console.log(['[', i, '] => ' + p + ' = ', results[i][p].toWMIString()].join(''));
                    }
                }
            }
            wmi.query('SELECT * FROM Win32_OperatingSystem', function(err, results) { 
                console.log('query#2 callback'); 
                console.log('err = ' + Utils.inspect(err));
                console.log('results = ' + Utils.inspect(results));
                wmi.query('SELECT * FROM Win32_OperatingSystem', function(err, results) { 
                    console.log('query#3 callback'); 
                    console.log('err = ' + Utils.inspect(err));
                    console.log('results = ' + Utils.inspect(results));
                    wmi.query('SELECT * FROM Win32_OperatingSystem', function(err, results) { 
                        console.log('query#4 callback'); 
                        console.log('err = ' + Utils.inspect(err));
                        console.log('results = ' + Utils.inspect(results));
                        wmi.dispose(function() { 
                            console.log('dispose callback');
                        });
                    });        
                });        
            });        
        });
    });

    Wmi.connect(function(err, wmi) {
        wmi.query('SELECT * FROM Win32_OperatingSystem', function(err, results) { 
            console.log('query#1 callback'); 
            console.log('err = ' + Utils.inspect(err));
            console.log('results = ' + Utils.inspect(results));
        });
        wmi.query('SELECT * FROM Win32_OperatingSystem', function(err, results) { 
            console.log('query#2 callback'); 
            console.log('err = ' + Utils.inspect(err));
            console.log('results = ' + Utils.inspect(results));
        });
        wmi.query('SELECT * FROM Win32_OperatingSystem', function(err, results) { 
            console.log('query#3 callback'); 
            console.log('err = ' + Utils.inspect(err));
            console.log('results = ' + Utils.inspect(results));
        });
        wmi.query('SELECT * FROM Win32_OperatingSystem', function(err, results) { 
            console.log('query#4 callback'); 
            console.log('err = ' + Utils.inspect(err));
            console.log('results = ' + Utils.inspect(results));
        });
        
        setTimeout(function() { 
            wmi.query('SELECT * FROM Win32_OperatingSystem', function(err, results) { 
                console.log('query#5 callback'); 
                console.log('err = ' + Utils.inspect(err));
                console.log('results = ' + Utils.inspect(results));
            }); 
        }, 5000);
        setTimeout(function() { wmi.dispose(); }, 10000);
        setTimeout(function() { 
            wmi.connect('infra1', 'root\\cimv2');
            wmi.query('SELECT * FROM meta_class WHERE __class LIKE \'Win32_A%\'', function(err, results) { 
                console.log('query#6 callback'); 
                console.log('err = ' + Utils.inspect(err));
                console.log('results = ' + Utils.inspect(results));
                wmi.query('SELECT name, arse FROM Win32_OperatingSystem', function(err, results) {
                    console.log('query#7 callback'); 
                    console.log('err = ' + Utils.inspect(err));
                    console.log('results = ' + Utils.inspect(results));
                    wmi.query('SELECT name, domain, domain, domain FROM Win32_Account', function(err, results) {
                        console.log('query#8 callback'); 
                        console.log('err = ' + Utils.inspect(err));
                        console.log('results = ' + Utils.inspect(results));
                        wmi.dispose(function() { clearTimeout(ii); });
                    });
                });
            }); 
        }, 15000);
    });
}