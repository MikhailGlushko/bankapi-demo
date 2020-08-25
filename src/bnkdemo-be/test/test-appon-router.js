/*
*
*/ 
 
 
const mocha = require('mocha');
const request = require('supertest');
const expect = require('chai').expect;
const assert = require('chai').assert;
const should = require('chai').should();

//var http = require('http');


//const i_host = 'localhost';
//const i_port = 3000

//const i_url='/bnkapi/appointment';
var test_env_list = [
  { zenv: 'localhost' ,zhost: 'localhost', zport: 3000, z_url: '/bnkapi/appointment', zprot: 'http' },
  { zenv: 'oc_dev', zhost: 'bnkapi-bnkdem-dev.apps-crc.testing', zport: 80, z_url: '/bnkapi/appointment', zprot: 'http' },
  { zenv: 'api', zhost: 'a7275984.eu-gb.apigw.appdomain.cloud', zport: 443, z_url: '/bnkapi-appmnt/appointment', zprot: 'https' },
]

var test_env_idx = 2;
var test_env_lr = false ;

const i_host = test_env_list[test_env_idx].zhost;
const i_port = test_env_list[test_env_idx].zport;
const i_url=test_env_list[test_env_idx].z_url;
const i_prot = test_env_list[test_env_idx].zprot;
  
console.log(  'Среда: ' +  test_env_list[test_env_idx].zenv);
console.log(  'HOST: ' +  i_host );
console.log(  'PORT: ' +  i_port );
console.log(  'URI: ' +  i_url.toString()  );  

const i_ins = [];
const i_upd = [];
const i_del = [];

var http = require('http');
if ( i_prot === 'https'  ) {
  var http = require('https');
}

describe('Appointment API', function() {
  let test_server;
  let app;
  this.timeout(0);

  before(done => {
    if ( test_env_idx === 0 ) {
        app = require(process.cwd() + '/server/server');
        test_server = app.listen(process.env.PORT || i_port, done);
    } else {
        done();
    } 
  });
 
  it('Options:' + i_url + ' Expect options http headers ', function(done){
    /**
     * Тестируем заголовки options  для подавления CORSA 
     */
  
    //this.skip(); 
    request(i_prot + '://' + i_host +':'+ i_port.toString() )
    .options(i_url)
    .set('Accept', 'application/json')
    //.expect('Content-Type', 'application/json; charset=utf-8')
    .expect(200)
    .end(function(err, res) {
        if (err) {
            console.log(err.message);
            done(err);
        } else {
            if (test_env_lr) {
              console.log( JSON.stringify(  res.headers  )  );
            }  
            done();
        }    
    });
  });  //it

  it('Post' + i_url +' Expect create doc', function(done){
    //this.skip(); 

    
    var l_req={ 
            mtype: "appointment",
            idcust: 1,
            cust_idreason: "deposit",
            cust_message: "No additional messages",
            cust_email: "bober@gmail.com",
            cust_phone: "+380502223344"
        
    };     
    if (test_env_lr) {
      console.log('Запрос: ');
      console.log( JSON.stringify(l_req) );
      console.log('Ответ: ');
    }  

    request(i_prot + '://' + i_host +':'+ i_port.toString() )
    .post(i_url)
    .send( l_req )
    .set('Accept', 'application/json')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(201)
    .end(function(err, res) {
        if (err) {
            console.log(err.message);
            done(err);
        } else {
          var lrsp = res.body;
          //lrsp.should.have.property('idacnt');
        if (test_env_lr) { console.log( JSON.stringify(  res.headers  )  ); }
          //  добавляю в массив для послед. удаления
          i_ins.push(  lrsp.id  );
          done();
        }    
    });
  });  //it

  it('Get' + i_url +' Expect get docs', function(done){
      //this.skip(); 
      var l_req={};

      if (test_env_lr) {
        console.log('Запрос: ');
        console.log( i_prot+'://' + i_host +':'+ i_port.toString() );
        console.log('Ответ: ');
      }  

      request(i_prot + '://' + i_host +':'+ i_port.toString() )
      .get(i_url)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function(err, res) {
          if (err) {
              console.log(err.message);
              done(err);
          } else {
            var lrsp = res.body;
          if (test_env_lr) { console.log( JSON.stringify(  res.headers  )  ); }
            done();
          }    
      });
  });  //it
  
  it('Get by Id' + i_url +' Expect get doc by ID', function(done){
    //this.skip(); 
    var l_req={};

    l_req.host= i_prot+'://' + i_host + ':'+ i_port.toString();
    l_req.url=i_url;
    l_req.query={id: i_ins[0].toString()};
    if (test_env_lr) {
        console.log('Запрос: ');
        console.log( JSON.stringify(l_req) );
        console.log('Ответ: ');
    }    


    request(i_prot + '://' + i_host +':'+ i_port.toString() )
    .get(i_url)
    .query( {id: i_ins[0].toString()} )
    .set('Accept', 'application/json')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(200)
    .end(function(err, res) {
        if (err) {
            console.log(err.message);
            done(err);
        } else {
          var lrsp = res.body;
        if (test_env_lr) { console.log( JSON.stringify(  res.headers  )  ); }
          done();
        }    
    });
  });  //it

  it('Put' + i_url +' Expect update account', function(done){
    this.skip(); 
    var l_req={ 
                acname: 'ПППП ППП ПП',   
                actype: '1',     
                dtclose: '2020-06-30', 
                bal: 4     
    };
    console.log('Запрос: ');
    console.log( JSON.stringify(l_req) );
    console.log('Ответ: ');
    request(i_prot + '://' + i_host +':'+ i_port.toString() )
    .put(i_url+'/' + i_ins[0].toString())
    .send( l_req )
    .set('Accept', 'application/json')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(200)
    .end(function(err, res) {
        if (err) {
            console.log(err.message);
            done(err);
        } else {
          var lrsp = res.body;
          lrsp.should.have.property( 'updated' );
        if (test_env_lr) { console.log( JSON.stringify(  res.headers  )  ); }
          //  добавляю в массив как обновлення запись
          i_upd.push(  lrsp.updated  );
          done();
        }    
    });
  });  //it

  it('Delete by Id' + i_url +' Expect delete document by ID', function(done){
    //this.skip(); 
    var l_req={};

    l_req.host= i_prot+'://' + i_host + ':'+ i_port.toString();
    l_req.url=i_url;
    l_req.query={id: i_ins[0].toString()};

    if (test_env_lr) {

        console.log('Запрос: ');
        console.log( JSON.stringify(l_req) );
        console.log('Ответ: ');
    }  
    request(i_prot + '://' + i_host +':'+ i_port.toString() )
    .delete(i_url)
    .query( {id: i_ins[0].toString()} )
    .set('Accept', 'application/json')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(200)
    .end(function(err, res) {
        if (err) {
            console.log(err.message);
            done(err);
        } else {
          var lrsp = res.body;
        if (test_env_lr) { console.log( JSON.stringify(  res.headers  )  ); }
          done();
        }    
    });
  });  //it

  // end of test
  after(done => {
    if ( test_env_idx === 0 ) {
        test_server.close(done);
    } else {
        done(); 
    }      

  });
});