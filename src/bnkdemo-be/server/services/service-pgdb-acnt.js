/**  
* pg  API 
* Service object for connection to accounts
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
 * клас управления Accounts
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
				if (err) {
					logger.error(  err.message  );		
					logger.error(  err  );		
				}
				else {
				//console.log( res);
				    logger.info(  'init-ok: ' + res.rows[0].now  );
				    pool.end();
				}
			});

			//serviceManager.set('couchdb', couchdb );
			//logger.info('couch-db.CreateService-OK');

	},
	getAccounts: function (request, response) {
		const pool = new Pool( idb_conn );
		pool.query('SELECT a.* FROM bnk.b_accounts a ORDER BY idacnt ASC', (err, results) => {
		  if (err) {
			pool.end();  
			throw err;
		  }
		  pool.end();
		  response.status(200).json(results.rows)
		})
	},
	getAccountById: function (request, response) {
		//const idacnt = parseInt(request.params.id)
		const idacnt = parseInt(request.query.id);
	    const pool = new Pool( idb_conn );
		pool.query('SELECT a.* FROM bnk.b_accounts a WHERE idacnt = $1', [idacnt], (err, results) => {
		  if (err) {
			pool.end();  
			throw err
		  }
		  pool.end();
		  response.status(200).json(results.rows[0])
		})
	},
	createAccount: function(request, response){
		const {acnum, ccy, actype, acname, idcust, dtopen, dtclose, bal}  = request.body ;
		
		
	    const pool = new Pool( idb_conn );
		pool.query('INSERT INTO bnk.b_accounts (acnum, ccy, actype, acname, idcust, dtopen, dtclose, bal) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [ acnum, ccy, actype, acname, idcust, dtopen, dtclose, bal], (err, results) => {
		  if (err) {
			pool.end();
			throw err
		  } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
			  pool.end();
			  throw err
		  }
		  pool.end();
		  let xres = {};
		  xres.idacnt = results.rows[0].idacnt;
		  response.status(201).send( xres);
		})
	},
	updateAccount: function(request, response){
		//const idacnt = parseInt(request.params.id)
		const { acname, actype, dtclose, bal, idacnt} = request.body ;
		const pool = new Pool( idb_conn );
		pool.query(
		  'UPDATE bnk.b_accounts SET acname = $1, actype = $2, dtclose = $3, bal = $4 WHERE idacnt = $5 RETURNING *',
		  [acname, actype, dtclose, bal, idacnt],
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
				   var lres = { updated: results.rows[0].idacnt };
				   response.status(200).send( lres );         	
			}
			
		  }
		)
	},
	deleteAccount: function(request, response){
		//const idacnt = parseInt(request.params.id)
		const idacnt = parseInt(request.query.id);
		const pool = new Pool( idb_conn );
		pool.query('DELETE FROM bnk.b_accounts WHERE idacnt = $1', [idacnt], (err, results) => {
		  if (err) {
			pool.end(); 
			throw err
		  }
		  pool.end();
		  var rdel = { deleted: idacnt};
		  response.status(200).send( rdel );
		})
	}
	  

};
// end:  couchdbSrvc

module.exports = pgdb ;
