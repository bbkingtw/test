
var express=require('express');
var app=express();

app.set('views', __dirname);
app.set('view engine', 'jade');

app.use(express.cookieParser());
app.use(express.bodyParser());

app.use(function(req,res,next){  
  console.log('===========================');
  console.log('middle start ');

  console.log('          ========');
  console.log('          cookie data');
  console.log(req.cookies);
  if (req.cookies['username']) {
    console.log('cookie id is found==>'+req.cookies['username']);
  }
  else {
    console.log('cookie id is not found');
  }
  next();
});

app.get('/', function(req, res){
  console.log('start get /');
  sID=req.cookies['username'];  
  starting=req.cookies['starting'];

  res.render(__dirname+'/cookie.jade',{
     sID:sID,
     start_time:'starting from '+starting
  });  
});

app.post('/',function(req,res){
  console.log('start post /');
  console.log(req.body);
  sID=req.body.username;

  res.cookie('username', sID, { maxAge: 30000, httpOnly: false}); 
  res.cookie('starting', new Date(), { maxAge: 30000, httpOnly: false}); 

  console.log('cookie is saved for '+sID);
  res.redirect('/');
});


app.listen(3000);

//app.listen(3000);