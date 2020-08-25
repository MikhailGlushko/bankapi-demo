/**
 * Модуль создания БД и ее начальной загрузки
 * 
 */

const axios = require('axios');
const async = require('async');
const log4js = require('log4js');
const IBMCloudEnv = require('ibm-cloud-env');
 
log4js.configure({
    appenders: { console: { type: 'console' } },
    categories: { default: { appenders: [ 'console' ], level: 'info' } }
});

const logger = log4js.getLogger('createCustappDB');
logger.level = process.env.LOG_LEVEL || 'info' ;

// CouchDB - пока не используем
const dbo = require('./service-couchdb');
const serviceManager = require('./service-manager');
dbo.init(null, serviceManager);


var i_dictappointments = [
  {
    "_id":              "appontitments",
    "id":               "appontitments",
    "mtype":            "type-appointment",
    "list": [
              {"apcode": "deposit", "apname": "Deposit cash"},
              {"apcode": "newcard", "apname": "get new card"},  
              {"apcode": "chashwithdrow", "apname": "get money by cash"},
              {"apcode": "signagrim", "apname": "sign agreement"}
    ]          
     
  }
];

var i_appointments = [
  {
    "_id":              "appont-1",
    "id":               "appont-1",
    "mtype":            "appointment",
    "idcust":           1,
    "cust_idreason":    "deposit",
    "cust_message":     "No additional messages",
    "cust_email":       "bober@gmail.com",
    "cust_phone":       "+380502223344",
    "app_date":         "2020-07-17",
    "app_time":         "11:15:01",           
    "app_status":       "NEW",
    "bnk_empid":        "0940",
    "bnk_empmsg":       "No emp messages" 
  },
  {
    "_id":              "appont-2",
    "id":               "appont-2",
    "mtype":            "appointment",
    "idcust":           2,
    "cust_idreason":    "newcard",
    "cust_message":     "No additional messages",
    "cust_email":       "misha@gmail.com",
    "cust_phone":       "+380501113344",
    "app_date":         "2020-06-17",
    "app_time":         "14:15:01",           
    "app_status":       "NEW",
    "bnk_empid":        "1940",
    "bnk_empmsg":       "No emp messages"

  },
  {
    "_id":              "appont-3",
    "id":               "appont-3",
    "mtype":            "appointment",
    "idcust":           3,
    "cust_idreason":    "chashwithdrow",
    "cust_message":     "No additional messages",
    "cust_email":       "misha@gmail.com",
    "cust_phone":       "+380501113344",
    "app_date":         "2020-06-17",
    "app_time":         "14:15:01",           
    "app_status":       "NEW",
    "bnk_empid":        "2940",
    "bnk_empmsg":       "No emp messages"
 
  }
];

var i_loanreq = [
  {
    "_id":              "loanreq-1",
    "id":               "loanreq-1",
    "mtype":            "loanreq",
    "idcust":           1,
    "cust_message":     "No additional messages",
    "cust_email":       "misha@gmail.com",
    "cust_phone":       "+380501113344",
    "loan_type":        "car",
    "loan_amount":      20000000,
    "loan_term":        24,
    "loan_collat_dsc":  "Сама машина и будет залогом",
    "app_date":         "2020-07-17",
    "app_time":         "11:15:01",           
    "app_status":       "NEW",
    "bnk_empid":        "0940",
    "bnk_empmsg":       "No emp messages" 
  },
  {
    "_id":              "loanreq-2",
    "id":               "loanreq-2",
    "mtype":            "loanreq",
    "idcust":           2,
    "cust_message":     "No additional messages",
    "cust_email":       "gosha@gmail.com",
    "cust_phone":       "+380681113344",
    "loan_type":        "mortage",
    "loan_amount":      5000000,
    "loan_term":        38,
    "loan_collat_dsc":  "Дача по адрему Матроскина 1 линия 4 будет залогом",
    "app_date":         "2020-07-17",
    "app_time":         "11:15:01",           
    "app_status":       "NEW",
    "bnk_empid":        "0940",
    "bnk_empmsg":       "No emp messages" 
  }
];

var i_cardlck = [
  {
    "_id":              "cardlck-1",
    "id":               "cardlck-1",
    "mtype":            "cardlck",
    "idcust":           1,
    "cust_message":     "Please, lock my card 123456789",
    "cust_email":       "misha@gmail.com",
    "cust_phone":       "+380501113344",
    "card_number":      "4444-3333-5555-1111",
    "app_date":         "2020-07-17",
    "app_time":         "11:15:01",           
    "app_status":       "NEW",
    "bnk_empid":        "0940",
    "bnk_empmsg":       "No emp messages" 
  },
  {
    "_id":              "cardlck-2",
    "id":               "cardlck-2",
    "mtype":            "cardlck",
    "idcust":           2,
    "cust_message":     "Please, lock my card 99998888777766665555",
    "cust_email":       "boba@gmail.com",
    "cust_phone":       "+380505553344",
    "card_number":      "4444-3333-5555-1111",
    "app_date":         "2020-07-17",
    "app_time":         "11:15:01",           
    "app_status":       "NEW",
    "bnk_empid":        "0940",
    "bnk_empmsg":       "No emp messages" 
  }

] ;

 
const indexCust = {
  index: { fields: ['mtype', 'cust_phone'] },
  name: 'phoneindex'
};

const indexPhone = {
  index: { fields: ['mtype', 'idcust'] },
  name: 'custindex'
};


const indexId = {
  index: { fields: ['id'] },
  name: 'appindex'
};

const indexDate = {
  index: { fields: ['app_date'] },
  name: 'dtindex'
};


class CustappSrvc {
  constructor () {
    /** тут прописывем instans переменные 
     *  Ели в конструкторе нужен асингхронный визов функции, то смотреть сюда:
     *  @see https://stackoverflow.com/questions/49694779/calling-an-async-function-in-the-constructor
     *  @see https://bytearcher.com/articles/asynchronous-call-in-constructor/
     *  @see https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Promise
     */
    
    this.i_reso ={ok: true, rdata: null};
    this.i_headers = { 'Content-Type': 'application/json',
        		           'accept': 'application/json'
    };

    IBMCloudEnv.init('/server/config/mappings.json');
    //this.swiftdoc_srv_url =  IBMCloudEnv.getString('URL_IIBGW');

    //dbo.dbClose(); 
    //dbo.init( null, serviceManager);
  }

  //UserException(message) {
	//	this.message = message;
	//	this.name = 'UserException';
  //}

	/**
	 * Проверяет, что переменная на undefined и не null
	 * если OK возвразает true, если не сложилось - false
	 * @param {any} p_value любая переменная
	 * @returns {boolean} l_result результат проверки переменной 
	 */
	isDefined(p_value) {
		let l_result = true ;
		if (typeof p_value === "undefined"){
			l_result=false;
		} else if ( p_value === null){
			l_result=false;
		} else {
			// do nothing
		};
		return l_result ;     
	}

  
  /**
   * 
   */
  createCustappDB( callback ) {
          var l_reso={}
          logger.info( 'Start: Начальная загрузка БД'   );
          logger.info( 'Подключаюсь к БД Cloudant' );
          return dbo.dbConnect()
          .then( dbo_res => {
            if (  !dbo_res.ok ){
                logger.error( 'Не удачное подключение к БД Cloudant ['+ dbo_res.dbname + ']');
                throw new Error('createCustappDB: dbo.dbConnect fails !');
            } 
            else if (  !dbo_res.isdbcreated ) {
              l_reso.ok=true;  
              logger.info( 'БД [ ' + dbo_res.dbname+' ]' + ' существует, загрузка данных не выполняется.' );
              callback( null, l_reso );
              return;             

            };
            logger.info( 'БД [ ' + dbo_res.dbname+' ]' + ' Выполняю начальную загрузку данных!' );
            var v1 = dbo.dbBulk({docs:i_dictappointments}); 
            var v2 = dbo.dbBulk({docs:i_appointments});
            var v3 = dbo.dbBulk({docs:i_loanreq});
            var v4 = dbo.dbBulk({docs:i_cardlck});
            
            var i1 = dbo.dbCreateIdx(indexCust);
            var i2 = dbo.dbCreateIdx(indexPhone);
            var i3 = dbo.dbCreateIdx(indexId);
            var i4 = dbo.dbCreateIdx(indexDate);
           
            var EachPromise = [];
            EachPromise.push( v1 );
            EachPromise.push( v2 );
            EachPromise.push( v3 );
            EachPromise.push( v4 );
  
            EachPromise.push( i1 );
            EachPromise.push( i2 );
            EachPromise.push( i3 );
            EachPromise.push( i4 );


            return Promise.all(EachPromise)
          })
          .then ( bulk_res => {

            var l_rdata=[];
            for (let key in bulk_res)
            {
              //var l_item = bulk_res[key].doclink;
              //l_rdata.push(l_item);
              logger.info(   JSON.stringify(  bulk_res[key] )  );
            }
            l_reso.ok=true;  
            callback( null, l_reso );
          })
          .catch(function (error){
            logger.error('this is error', error.message);
            callback( error);
          }); 
  }	

  
}  // end class

module.exports = CustappSrvc;

