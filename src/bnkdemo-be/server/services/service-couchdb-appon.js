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





class AppointmentSrvc {
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
    }


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
    getAppointmens ( request, response ) {
            var l_selector = {
                "selector": {
                   "mtype": {
                      "$eq": "appointment"
                   }
                }
            };
            logger.info('getAppointmens: Start');
            return dbo.dbConnect()
            .then( dbo_res => {
                if (  !dbo_res.ok ){
                    throw new Error('getAppointmens: dbo.dbConnect fails !');
                }
                return dbo.dbSelect(l_selector);
            })
            .then ( r_data => {
                //callback( null, response.status(200).json(r_data) );
                logger.info('getAppointmens: Finish-OK');
                logger.info('getAppointmens: result='+ JSON.stringify(r_data.rdata.docs));
                return Promise.resolve( response.status(200).json(r_data.rdata.docs) );
            })
            .catch(function (err){
                logger.info('getAppointmens: Finish with ERROR! [' + err.message + ']');
                logger.error('this is error', err.message);
                return Promise.reject( response.status(500).json( {error: err.message }) );
                //callback( err);
            }); 
    }	

   /**
    * 
    */
   getAppointmenById ( request, response ) {
        //var lr_id = request.params.id;
        var lr_id= parseInt(request.query.id);
        var l_selector = {
            "selector": {
                "_id": {
                    "$eq": lr_id
                }
            }
        };
        return dbo.dbConnect()
        .then( dbo_res => {
            if (  !dbo_res.ok ){
                throw new Error('getAppointmenByid: dbo.dbConnect fails !');
            }
            return dbo.dbSelect(l_selector);
        })
        .then ( r_data => {
            //callback( null, response.status(200).json(r_data) );
            return Promise.resolve( response.status(200).json(r_data.rdata.docs) );
        })
        .catch(function (err){
            logger.error('this is error', err.message);
            return Promise.reject( response.status(500).json( {error: err.message }) );
            //callback( err);
        }); 
    }	


    /**
     * Создать заявку
     * @param {*} request 
     * @param {*} response 
     */
    createAppointmen(request, response){
        return dbo.dbConnect()
        .then( dbo_res => {
            if (  !dbo_res.ok ){
                throw new Error('getAppointmens: dbo.dbConnect fails !');
            }
            return dbo.dbNextId()
        })
        .then( next_res=>{
            var l_id = 'appont-' + next_res.uuids[0];
            var l_doc = { mtype: null, 
                idcust: null,
                cust_idreason: null, 
                cust_message: null, 
                cust_email: null,
                cust_phone: null,
                app_date: null , 
                app_time: null,
                app_status: null,
                bnk_empid: null, 
                bnk_empmsg: null 
            };
            
            var l_dt = new Date();
            l_doc = request.body ;
            l_doc._id = l_id ;
            l_doc.mtype='appointment';
            l_doc.app_date = l_dt.toJSON().substr(0,10);
            l_doc.app_time = l_dt.toLocaleTimeString();
            l_doc.app_status = 'new'; 
            return dbo.dbInsert( l_doc );
        })
        .then ( dbins_res => {
            return Promise.resolve( response.status(201).json( {id: dbins_res .id}) );

        })  
        .catch(function (err){
                logger.error('this is error', err.message);
                return Promise.reject( response.status(500).json( {error: err.message }) );
        }); 


    }

    deleteAppointment  ( request, response ) {
        //var lr_id = request.params.id;
        var lr_id = request.query.id;
        //var l_selector = {
        //    "selector": {
        //        "_id": {
        //            "$eq": lr_id
        //        }
        //    }
        //};
        return dbo.dbConnect()
        .then( dbo_res => {
            if (  !dbo_res.ok ){
                throw new Error('deleteAppointment: dbo.dbConnect fails !');
            }
            return dbo.dbGetDoc(lr_id);
        })
        .then ( res_doc =>{
            var lr_doc_id = res_doc.rdata._id ;  
            var lr_doc_rev = res_doc.rdata._rev
            return dbo.dbDelete( lr_doc_id, lr_doc_rev);
        })
        .then ( res_del => {
            //callback( null, response.status(200).json(r_data) );
            return Promise.resolve( response.status(200).json( res_del) );
        })
        .catch(function (err){
            logger.error('this is error', err.message);
            return Promise.reject( response.status(500).json( {error: err.message }) );
            //callback( err);
        }); 
    }	

  
}  // end class

module.exports = AppointmentSrvc;

