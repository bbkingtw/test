var express=require('express');

var app=express();//.createServer();

//app.engine('.html', require('jade'));
//app.engine('html', require('jade').renderFile);
app.engine('htm', require('ejs').renderFile);

app.set('views', __dirname + '/');
app.set('view engine','jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.errorHandler());

app.use('/static', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('mouse.htm');
});

app.get('/page/:page', function(req, res) {
    res.render(req.params.page);
});

app.get('/try',function(req,res){
    res.sendfile('drag.htm');
});

app.get('/echo/:value',function(req, res) {
    res.end(req.params.value); 
});

app.post('/upload', function(req,res){
    app.use(express.bodyParser());
    sID=req.body.stock;
    sDESC=req.body.description;

    //res.send(sID+'==>'+sDESC);
    var ar=sID.split(',')
    var webs={};

    for (var x in ar) {
       console.log(x);
       webs['x'+x]=ar[x];
       //webs=webs+'<iframe src="http://tw.stock.yahoo.com/q/q?s="+x></iframe><br>\n';        		
    }	
    console.log(webs);

    res.render('upload_page.jade',{
	'id':sID, 
	web_pages:webs
    });          
});

// spin up server
app.listen(80, '127.0.0.1')