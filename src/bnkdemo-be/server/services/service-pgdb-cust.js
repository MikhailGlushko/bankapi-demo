/**  
* pg  API 
* Service object for connection to CouchDB
*/


const uuidv4 = require('uuid/v4');
const IBMCloudEnv = require('ibm-cloud-env');
const log4js = require('log4js');

const { Pool, Client } = require('pg')
//const pool = new Pool();
//const client = new Client();



 
log4js.configure({
    appenders: { console: { type: 'console' } },
    categories: { default: { appenders: [ 'console' ], level: 'info' } }
});

const logger = log4js.getLogger('service-pgdb');
logger.level = process.env.LOG_LEVEL || 'info' ;


IBMCloudEnv.init('/server/config/mappings.json');

const idb_port =  IBMCloudEnv.getString('DB_PORT');
const idb_dbnm =  IBMCloudEnv.getString('DB_NAME');
const idb_dbusr =  IBMCloudEnv.getString('DB_USER');
const idb_dbpsw =  IBMCloudEnv.getString('DB_PSW');
const idb_dbhost =  IBMCloudEnv.getString('DB_HOST');

const idb_conn = {
		user: idb_dbusr,
		host: idb_dbhost,
		database: idb_dbnm,
		password: idb_dbpsw,
		port: idb_port
};




/**
 * клас управления CouchDB
 */
var pgdb = {

	/**
	 * Подключение к сервису БД
	 * Прочитывает конфигурацию и возвращает  обьек-сервис базы данных
	 * @param {*} app  - @@see server/server.js
	 * @param {*} serviceManager   - @@server/service/service-manager.js 
	 *                               возвращает массив нужных классов 
	 */ 
	init: function (app, serviceManager) {
			logger.info('postgres-db.CreateService');
			//logger.info('conn: ' + JSON.stringify( idb_conn ) );
			const pool = new Pool( idb_conn );
			pool.query('SELECT NOW()', (err, res) => {
				//console.log( res);
				logger.info(  'init-ok: ' + res.rows[0].now  );
				pool.end();
			});

			//serviceManager.set('couchdb', couchdb );
			//logger.info('couch-db.CreateService-OK');

	},
	getCustomers: function (request, response) {
		const pool = new Pool( idb_conn );
		pool.query('SELECT a.* FROM bnk.b_cust a ORDER BY idcust ASC', (err, results) => {
		  if (err) {
			pool.end();  
			throw err;
		  }
		  pool.end();
		  response.status(200).json(results.rows)
		})
	},
	getCustomerById: function (request, response) {
		//const idcust = parseInt(request.params.id)
		const idcust = parseInt(request.query.id);
	    const pool = new Pool( idb_conn );
		pool.query('SELECT a.* FROM bnk.b_cust a WHERE idcust = $1', [idcust], (err, results) => {
		  if (err) {
			pool.end();  
			throw err
		  }
		  pool.end();
		  response.status(200).json(results.rows[0])
		})
	},
	createCustomer: function(request, response){
		const {first_nm, last_nm, email, tin, phone}  = request.body ;
	    const pool = new Pool( idb_conn );
		pool.query('INSERT INTO bnk.b_cust (first_nm, last_nm, email, tin, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *', [ first_nm, last_nm, email, tin, phone], (err, results) => {
		  if (err) {
			pool.end();
			throw err
		  } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
			  pool.end();
			  throw err
		  }
		  pool.end();
		  let xres = {};
		  xres.idcust = results.rows[0].idcust;
		  //response.status(201).send('{xres: ${results.rows[0].idcust} }');
		  response.status(201).send( xres);
		})
	},
	updateCustomer: function(request, response){
		//const idcust = parseInt(request.query.id);  //parseInt(request.params.id)
		const {first_nm, last_nm, email, tin, phone, idcust}  = request.body ;
		const pool = new Pool( idb_conn );
		pool.query(
		  'UPDATE bnk.b_cust SET first_nm = $1, last_nm = $2, email = $3, tin = $4, phone = $5 WHERE idcust = $6 RETURNING *',
		  [first_nm, last_nm, email, tin, phone, idcust],
		  (err, results) => {
			if (err) {
				pool.end();
			  throw err
			} 
			if (typeof results.rows == 'undefined') {
				pool.end();
				var lres = { updated: -2 };
				response.status(404).send( lres );
			} else if (Array.isArray(results.rows) && results.rows.length < 1) {
				pool.end();
				var lres = { updated: -1 };
				response.status(404).send( lres );
			} else {
				   pool.end();
				   var lres = { updated: results.rows[0].idcust };
				   response.status(200).send( lres );         	
			}
			
		  }
		)
	},
	deleteCustomer: function(request, response){
		const idcust = parseInt(request.query.id); //parseInt(request.params.id)
		const pool = new Pool( idb_conn );
		pool.query('DELETE FROM bnk.b_cust WHERE idcust = $1', [idcust], (err, results) => {
		  if (err) {
			pool.end(); 
			throw err
		  }
		  pool.end();
		  var rdel = { deleted: idcust};
		  response.status(200).send( rdel );
		})
	}
	  

};
// end:  couchdbSrvc

module.exports = pgdb ;
