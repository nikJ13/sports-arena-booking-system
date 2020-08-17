var http = require('http');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
//dbst mysql = require('mysql');
var sqlite3 = require('sqlite3').verbose();

var g;
var user;
var staff;

//Middleware
app.use(bodyParser.urlencoded({extended:true}));

/*var db_data = {
    host : "remotemysql.com",
    user : "F7R05a0c2c",
    password: "FnOR6qpsy7",
    database: "F7R05a0c2c",
    "port" : "3306"
};*/

var que;

//var db = mysql.createdbnection(db_data);

let db = new sqlite3.Database('./lite.db',(err) => {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when dbnecting to db:', err);
    }                      
    console.log("Database dbnected!!");
  }); 

que = 'CREATE TABLE IF NOT EXISTS USER(ID INTEGER PRIMARY KEY AUTOINCREMENT, firstname TEXT, lastname TEXT, username TEXT, mobileno NUMBER, password TEXT, address1 TEXT, address2 TEXT, address3 TEXT, zipcode NUMBER);';

db.all(que, function(err, result){
	if (err) throw err;
	console.log(result);
});

app.listen(3000);



app.use(express.static(path.join(__dirname, 'public')));


app.set('views', path.join(__dirname, 'views'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.get('/logindetail', function(req, res){
	var data = req.all;

	que = `SELECT *  FROM USER WHERE username='${data.username}' and password='${data.password}';` ;

	db.all(que, function(err, result){
		if (err) throw err;
    
		console.log('RESULT');
		console.log(result);
		console.log('RESULT LENGTH');
		console.log(result.length);
		
		var k=result[0];
		//console.log('1'+k);
		console.log('USER');
		console.log(k.username);
		user=k.username;
		console.log('the username is'+user);
		
		if(result.length!=0)
			res.write('1');

		else 
			res.write('0');

		res.end();

	});

	console.log(data);
});

app.get('/gstaffdetail', function(req, res){
	var data = req.all;

	console.log('this is ground staff site');
	console.log('user is '+ user);
	console.log(data.username);

	que = `INSERT INTO GROUND SELECT sportname,gid,groundname,gaddress1,gaddress2,gaddress3,gzipcode,rating,gstaffid,slot,price  FROM GROUND2 WHERE username='${data.username}';` ;

	db.all(que, function(err, result){
		if (err) throw err;
    
		console.log('RESULT');
		console.log(result);
		console.log('RESULT LENGTH');
		console.log(result.length);
		

	});

	console.log(data);
});




app.post('/signupdetail', function(req, res){
	console.log("test");
	var data = req.body;
	console.log("test:",data);
	que = `INSERT into USER(firstname,lastname,username,password,mobileno,address1,address2,address3,zipcode) VALUES('${data.firstname}','${data.lastname}','${data.username}','${data.password}', '${data.mobileno}','${data.address1}','${data.address2}','${data.address3}','${data.zipcode}');`;
	
	db.all(que, function(err, result){
		if (err) throw err;

		console.log(result);

		res.end();

	});

	console.log(data);
	res.render('index');
});


app.get('/staffsignupdetail', function(req, res){
	var data = req.all;

	que = `insert into GROUND_STAFF VALUES('${data.staffname}','${data.staffid}','${data.mobileno}');`;
	db.all(que, function(err, result){
		if (err) throw err;

		console.log(result);

		res.end();

	});
	que = `insert into GROUND VALUES('${data.sportname}','${data.gid}','${data.groundname}','${data.address1}','${data.address2}','${data.address3}','${data.zipcode}','${data.rating}','${data.staffid}','${data.slot}','${data.price}');`;
	db.all(que, function(err, result){
		if (err) throw err;

		console.log(result);

		res.end();

	});

	console.log(data);
});


app.get('/bookingdetail', function(req, res){
	var data = req.all;

	que = `SELECT * FROM GROUND WHERE sportname='${data.Sport}' and slot='${data.Slot}' and gaddress3='${data.Location}'`;
	db.all(que, function(err, result){
		if (err) throw err;

		console.log(result);
		var k;
		k=JSON.stringify(result[0]);
		if(result.length==0)
		{
			res.write('no grounds available');
		}
		else
		{

		res.write(k);}

		res.end();
		});
	});


app.get('/bookingupdate', function(req, res){
var data = req.all;
console.log('the name of the user is '+user);

	que=`SELECT booking1,booking2 FROM USER WHERE username='${user}'`;
	db.all(que, function(err, result){
		
		if (err) throw err;
		
	
			console.log(result);
			console.log(JSON.stringify(result[0].booking1));
				console.log(JSON.stringify(result[0].booking2));

			if(JSON.stringify(result[0].booking1)=='null')
		{
			console.log('inside if    @@@@@@@@@@@@@@@@@@');
			que = `update USER set booking1='${data.groundname}' where username='${user}'`;
			db.all(que, function(err, result){
			if (err) throw err;

			console.log(result);
			console.log('chalgaya');
			var k;
		

			res.end();

		});

		}

		else if(JSON.stringify(result[0].booking2)=='null')
		
		{
			console.log('inside elseif    @@@@@@@@@@@@@@@@@@');
			que = `update USER set booking2='${data.groundname}' where username='${user}'`;
			db.all(que, function(err, result){
			if (err) throw err;

			console.log(result);
			console.log('chalgaya');
			var k;
		

			res.end();

		});
			

		}

	else 
		{
			var k='ALREADY EXCEEDS MAX BOOKING';
			res.write(k);
		console.log('nhi chala');
		res.end();
	}

	



	/*que = `update USER set booking1='${data.groundname}' where username='${user}'`;
	db.all(que, function(err, result){
		if (err) throw err;

		console.log(result);
		console.log('chalgaya');
		var k;
		

		res.end();

	});*/

	console.log(data);
});
	
	
	que=`INSERT INTO GROUND2(username) VALUES('${user}');`
	db.all(que, function(err, result){
			if (err) throw err;

			console.log(result);
			console.log('chalgaya');
			var k;
		

			res.end();

		});

	que=`DELETE FROM GROUND WHERE groundname='${data.groundname}' and slot='${data.slot}';`
	db.all(que, function(err, result){
			if (err) throw err;

			console.log(result);
			console.log('chalgaya');
			var k;
		

			res.end();

		});		



});





app.get('/', function(req, res){
	res.render('index');
});

app.get('/signup', function(req, res){
	res.render('signup');
});

app.get('/login', function(req, res){
	res.render('login');
});
app.get('/bookings', function(req, res){
	res.render('bookings');
});
app.get('/gstaff', function(req, res){
	res.render('gstaff');
});
app.get('/gstaffadd', function(req, res){
	res.render('gstaffadd');
});
app.get('/gstaffloginadd', function(req, res){
	res.render('gstaffloginadd');
});
app.get('/gstafflogin', function(req, res){
	res.render('gstafflogin');
});
app.get('/staffsignup', function(req, res){
	res.render('staffsignup');
});

app.get('/gstaffmaintainance', function(req, res){
	res.render('gstaffmaintainance');
});
app.get('/gstafflogindetail', function(req, res){
	var data = req.all;

	que = `SELECT *  FROM GROUND_STAFF WHERE staffname='${data.username}' and staffid='${data.password}';` ;

	db.all(que, function(err, result){
		if (err) throw err;
    
		console.log('RESULT');
		console.log(result);
		console.log('RESULT LENGTH');
		console.log(result.length);
		
		var k=result[0];
		//console.log('1'+k);
		console.log('USER');
		console.log(k.staffname);
		staff=k.staffname;
		console.log('the username is'+staff);
		
		if(result.length!=0)
			res.write('1');

							

		else 
			res.write('0');

		res.end();

	});

	console.log(data);
});
app.get('/gstaffloginadddetail', function(req, res){
	var data = req.all;

	que = `SELECT *  FROM GROUND_STAFF WHERE staffname='${data.username}' and staffid='${data.password}';` ;

	db.all(que, function(err, result){
		if (err) throw err;
    
		console.log('RESULT');
		console.log(result);
		console.log('RESULT LENGTH');
		console.log(result.length);
		
		var k=result[0];
		//console.log('1'+k);
		console.log('USER');
		console.log(k.staffname);
		staff=k.staffname;
		console.log('the username is'+staff);
		
		if(result.length!=0)
			res.write('1');

							

		else 
			res.write('0');

		res.end();

	});

	console.log(data);
});
app.get('/gstaffmaintainancedetail', function(req, res){
	var data = req.all;

	que = `SELECT *  FROM GROUND A, GROUND_STAFF B WHERE B.staffid=A.gstaffid and staffname='${staff}';` ;

	db.all(que, function(err, result){
		if (err) throw err;
		staffid=result[0].gstaffid;
    
		console.log('RESULT');
		console.log(result);
		console.log('RESULT LENGTH');
		console.log(result.length);
		
		var k=JSON.stringify(result);
		res.write(k);
		//console.log('1'+k);
		console.log('USER');
		console.log(k);
		res.end();
		
		
		
	});

	console.log(data);
});
app.get('/gstaffmaintainancedetail2', function(req, res){
	var data = req.all;

	que = `DELETE FROM GROUND WHERE gstaffid='${staffid}' and slot='${data.slot}'` ;

	db.all(que, function(err, result){
		if (err) throw err;
    
		console.log('RESULT');
		console.log(result);
		console.log('RESULT LENGTH');
		console.log(result.length);
		
		var k=JSON.stringify(result);
		res.write(k);
		//console.log('1'+k);
		console.log('USER');
		console.log(k);
		res.end();
		
		
		
	});

	console.log(data);
});
app.get('/gstaffadddetail', function(req, res){
	var data = req.all;

	que = `SELECT *  FROM GROUND A, GROUND_STAFF B WHERE B.staffid=A.gstaffid and staffname='${staff}';` ;

	db.all(que, function(err, result){
		if (err) throw err;
    
		console.log('RESULT');
		console.log(result);
		g=result[0];
		console.log('RESULT LENGTH');
		console.log(result.length);
		
		var k=JSON.stringify(result);
		res.write(k);
		//console.log('1'+k);
		console.log('USER');
		console.log(k);
		res.end();
		
		
		
	});

	console.log(data);
});

app.get('/gstaffadddetail2', function(req, res){
	var data = req.all;

	que = `INSERT into GROUND VALUES('${g.sportname}','${g.gid}','${g.groundname}','${g.gaddress1}','${g.gaddress2}','${g.gaddress3}','${g.gzipcode}','${g.rating}','${g.gstaffid}','${data.slot}','${g.price}');`;

	db.all(que, function(err, result){
		if (err) throw err;
    
		console.log('RESULT');
		console.log(result);
		console.log('RESULT LENGTH');
		console.log(result.length);
		
		var k=JSON.stringify(result);
		res.write(k);
		//console.log('1'+k);
		console.log('USER');
		console.log(k);
		res.end();
		
		
		
	});

	console.log(data);
});





