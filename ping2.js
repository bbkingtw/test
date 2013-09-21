var sys = require('sys')
var exec = require('child_process').exec;

function puts(error, stdout, stderr) { 
  //if (stdout.substring(0,5)=='Reply') {
  //console.log('-------------');
  //console.log(stdout); 
  //console.log('-------------');

  if ( stdout.indexOf('Reply') != -1 ) {
    sys.puts(sHost+'=>'+'ok');	
  }
  else {
    sys.puts(sHost+'=>'+'error');
  }
}

if (process.argv.length>2) {
  sHost=process.argv[2];
}
else {
  sHost='Localhost';
}



if (process.argv.length>2) {
  sHost=process.argv[2];
}
else {
  sHost='Localhost';
}


hosts=[];

//console.log('shost==>'+sHost);
function test() {
  exec("ping -n 1 "+sHost, puts);
}

exports.ping=function(sHost) {
  exec("ping -n 1 "+sHost, puts);
}

exports.pingAll=function(cb){
  hosts.forEach(function(sHost){
    exec("ping -n 1 "+sHost, function(error, stdout, stderr) { 
      if ( stdout.indexOf('Reply') != -1 ) 
        cb(sHost+'=>ok')
      else
	cb(sHost+'=>fail');
    });
  });
}

exports.add_host=function(sHost){
  hosts.push(sHost);
  console.log(hosts);  
}

//test();
//test();

//setInterval(function(){test();},1000);