/*
*
*/ 
 
 
const mocha = require('mocha');
const request = require('supertest');
const expect = require('chai').expect;
const assert = require('chai').assert;
const should = require('chai').should();



var test_env_list = [
   { zenv: 'localhost' ,zhost: 'localhost', zport: 3000, z_url: '/bnkapi/customer', zprot: 'http' },
   { zenv: 'oc_dev', zhost: 'bnkapi-bnkdem-dev.apps-crc.testing', zport: 80, z_url: '/bnkapi/customer', zprot: 'http' },
   { zenv: 'api', zhost: 'a7275984.eu-gb.apigw.appdomain.cloud', zport: 443, z_url: '/bnkapi-cust/customer', zprot: 'https' },
]

var test_env_idx = 2;
var test_env_lr = true ;

const i_host = test_env_list[test_env_idx].zhost;
const i_port = test_env_list[test_env_idx].zport;
const i_url_cust=test_env_list[test_env_idx].z_url;
const i_prot = test_env_list[test_env_idx].zprot;
   
console.log(  'Среда: ' +  test_env_list[test_env_idx].zenv);
console.log(  'HOST: ' +  i_host );
console.log(  'PORT: ' +  i_port );
console.log(  'URI: ' +  i_url_cust.toString()  );  

const i_ins = [];
const i_upd = [];
const i_del = [];

var http = require('http');
if ( i_prot === 'https'  ) {
  var http = require('https');
}



describe('Customer API', function() {
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
 
  it('Options:' + i_url_cust + ' Expect options http headers ', function(done){
    /**
     * Тестируем заголовки options  для подавления CORSA 
     */
  
    //this.skip(); 
    request( i_prot + '://' + i_host +':'+ i_port.toString() )
    .options(i_url_cust)
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

  it('Post' + i_url_cust +' Expect create customer', function(done){
    //this.skip(); 

    
    var l_req={ first_nm: ' Петро ', 
                last_nm: 'Бурякович' , 
                email: 'pb.bu@gmail.com', 
                tin: '0101010111', 
                phone: '+380501234455'
            };
    
    if (test_env_lr) {
      console.log('Запрос: ');
      console.log( JSON.stringify(l_req) );
      console.log('Ответ: ');
    }  
    request(i_prot+'://' + i_host +':'+ i_port.toString() )
    .post(i_url_cust)
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
          lrsp.should.have.property('idcust');
          if (test_env_lr) {
              console.log(  JSON.stringify(res.body)  );
          }    
          //  добавляю в массив для послед. удаления
          i_ins.push(  lrsp.idcust  );
          done();
        }    
    });
  });  //it

  it('Get' + i_url_cust +' Expect get customers', function(done){
      //this.skip(); 
      var l_req={};
      if (test_env_lr) {
        console.log('Запрос: ');
        console.log( i_prot+'://' + i_host +':'+ i_port.toString() );
        console.log('Ответ: ');
      }  
      request( i_prot+'://' + i_host +':'+ i_port.toString() )
      .get(i_url_cust)
      //.send( l_req )
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end(function(err, res) {
          if (err) {
              console.log(err.message);
              done(err);
          } else {
            var lrsp = res.body;
            //lrsp.should.have.property('ok');
            //lrsp.ok.should.equal(true);
            //lrsp.should.have.property('rdata');
            //expect(lrsp.rdata).to.be.an('array');
            if (test_env_lr) {
                console.log(  JSON.stringify(res.body)  );
            }
            //  добавляю в массив для послед. удаления
            //for (index = lrsp.rdata.length - 1; index >= 0; --index) {
            //     i_iddocsrdy.push(  lrsp.rdata[index].iddoc  );
            //};

            done();
          }    
      });
  });  //it
  
  it('Get by Id' + i_url_cust +' Expect get customer by ID', function(done){
    //this.skip(); 
    var l_req={};
    l_req.host= i_prot+'://' + i_host + ':'+ i_port.toString();
    l_req.url=i_url_cust;
    l_req.query={id: i_ins[0].toString()};
    if (test_env_lr) {
        console.log('Запрос: ');
        console.log( JSON.stringify(l_req) );
        console.log('Ответ: ');
    }    
    request( i_prot+'://' + i_host + ':'+ i_port.toString() )
    .get(i_url_cust  )
    .query( {id: i_ins[0].toString()} )
    .set('Accept', 'application/json')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(200)
    .end(function(err, res) {
        if (err) {
            console.log(err);
            done(err);
        } else {
          var lrsp = res.body;
          if (test_env_lr) {
              console.log(  JSON.stringify(res.body)  );
          }    
          done();
        }    
    });
  });  //it

  it('Put' + i_url_cust +' Expect update customer', function(done){
    //this.skip(); 
    var l_req={ idcust: i_ins[0].toString(),
                first_nm: ' Петро wXX', 
                last_nm: 'БуряковичXXw' , 
                email: 'pb.bu@gmail.comXXw', 
                tin: '0101010111', 
                phone: '+380501234455'
    };
    if (test_env_lr) {
        console.log('Запрос: ');
        console.log( JSON.stringify(l_req) );
        console.log('Ответ: ');
    }    
    request( i_prot+'://' + i_host +':'+ i_port.toString() )
    .put(i_url_cust )
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
          if (test_env_lr) {
              console.log(  JSON.stringify(res.body)  );
          }    
          //  добавляю в массив как обновлення запись
          i_upd.push(  lrsp.updated  );
          done();
        }    
    });
  });  //it

  it('Delete by Id' + i_url_cust +' Expect delete customer by ID', function(done){
    //this.skip(); 
    var l_req={};
    l_req.host= i_prot+'://' + i_host + ':'+ i_port.toString();
    l_req.url=i_url_cust;
    l_req.query={id: i_ins[0].toString()};
    if (test_env_lr) {

        console.log('Запрос: ');
        console.log( JSON.stringify(l_req) );
        console.log('Ответ: ');
    }    
    request(i_prot+'://' + i_host +':'+ i_port.toString() )
    .delete(i_url_cust)
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
          if (test_env_lr) {
              console.log(  JSON.stringify(res.body)  );
          }    
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