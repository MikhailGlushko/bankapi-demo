/** 
 * Роутер для работы со  счетами
 *
 */
const express = require('express');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const serviceManager = require(process.cwd() +'/server/services/service-manager');

const dbsrvc = require( '../services/service-pgdb-cards');

const log4js = require('log4js');
log4js.configure({
  appenders: { console: { type: 'console' } },
  categories: { default: { appenders: [ 'console' ], level: 'info' } }
});
const logger = log4js.getLogger('CardRouter');
logger.level = process.env.LOG_LEVEL || 'info' ;
/**
 * @see https://riptutorial.com/ru/node-js/example/28740/%D0%B2%D0%BA%D0%BB%D1%8E%D1%87%D0%B8%D1%82%D1%8C-cors-%D0%B2-express-js
 *
 */

const resp_headers = {
                    'Accept': 'application/json', 
                    'Access-Control-Allow-Origin': '*',  
                    'Access-Control-Allow-Headers': 'Content-Type,ad-name, x-powered-by, date',
                    'Access-Control-Allow-Methods': 'DELETE,GET,PATCH,POST,PUT',
                    'Content-Type': 'application/json; charset=utf-8'        
};





module.exports = function (app) {

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, ad-name, x-powered-by, date");
    res.header('Access-Control-Allow-Methods', 'DELETE,GET,PATCH,POST,PUT'); 
    res.header('Content-Type', 'application/json; charset=utf-8');
    next();
  });

  /**
	 * Проверяет, что переменная на undefined и не null
	 * если OK возвразает true, если не сложилось - false
	 * @param {any} p_value любая переменная
	 * @returns {boolean} l_result результат проверки переменной 
	 */
	const isDefined = function (p_value) {
		let l_result = true ;
		if (typeof p_value === "undefined"){
			l_result=false;
		} else if ( p_value === null){
			l_result=false;
		} else {
			// do nothing
		};
		return l_result ;     
	};


  /**
   */
  const i_api_card_url='/bnkapi/cards'; 
  const router_card = express.Router();
  app.use(i_api_card_url, router_card);

  /**
  * options
  */
  router_card.options('/', function(req, res) {
      var l_step='';
      logger.info('================================');
      logger.info('router options:' + i_api_card_url);
      logger.info('Req.Headers:');
      logger.info(JSON.stringify(req.headers) );
      logger.info('================================');
      return res.status(200).end();
  });  

  /**
  * get accounts list
  */
  router_card.get('/', function(req, res) {
      var l_step='';
      logger.info('================================');
      logger.info('router get:' + i_api_card_url);
      logger.info('Req.Headers:');
      logger.info(JSON.stringify(req.headers) );
      logger.info('================================');
      logger.info( '!!!!!####['+ req.query.id + ']####!!!!');
      
      //const idcust = request.params.id;

      if ( isDefined(req.query.id) ) {
          logger.info('Get card by id');
          return dbsrvc.getCardById(req,res);
      } else {
          logger.info( 'Get all Cards');
          return dbsrvc.getCards(req,res);
      }
;
  });  

  /**
  * get account
  */
  router_card.get('/:id', function(req, res) {
      var l_step='';
      logger.info('================================');
      logger.info('router get:' + i_api_card_url);
      logger.info('Req.Headers:');
      logger.info(JSON.stringify(req.headers) );
      logger.info('Req.params:');
      logger.info(JSON.stringify(req.params.id) );
      logger.info('================================');
      return dbsrvc.getCardById(req,res);
  });  


  /**
   * POST     
   * 
   */
  router_card.post('/', function(req, res) {
    
      var l_step='';
      logger.info('================================');
      logger.info('router get:' + i_api_card_url);
      logger.info('Req.Headers:');
      logger.info(JSON.stringify(req.headers) );
      logger.info('================================');
      return dbsrvc.createCard(req,res);
  });    

  /**
  * update 
  */
  router_card.put('/', function(req, res) {
    var l_step='';
    logger.info('================================');
    logger.info('router put:' + i_api_card_url);
    logger.info('Req.Headers:');
    logger.info(JSON.stringify(req.headers) );
    logger.info('Req.params:');
    logger.info(JSON.stringify(req.params.id) );
    logger.info('================================');
    return dbsrvc.updateCard(req,res);
  });  


  /**
  * delete 
  */
  router_card.delete('/', function(req, res) {
    var l_step='';
    logger.info('================================');
    logger.info('router delete:' + i_api_card_url);
    logger.info('Req.Headers:');
    logger.info(JSON.stringify(req.headers) );
    logger.info('Req.params:');
    logger.info(JSON.stringify(req.params.id) );
    logger.info('================================');
    return dbsrvc.deleteCard(req,res);
  });  

 



  //==============================
} // Module exports
  //==============================