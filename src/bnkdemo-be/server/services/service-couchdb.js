/**  
* CouchDB API 
* Service object for connection to CouchDB
*/


const http = require('http');
//const nano = require('nano');
const uuidv4 = require('uuid/v4');
const IBMCloudEnv = require('ibm-cloud-env');
const log4js = require('log4js');
 
log4js.configure({
    appenders: { console: { type: 'console' } },
    categories: { default: { appenders: [ 'console' ], level: 'info' } }
});

const logger = log4js.getLogger('service-db');
logger.level = process.env.LOG_LEVEL || 'info' ;


IBMCloudEnv.init('/server/config/mappings.json');

const idb_host =  IBMCloudEnv.getString('DBC_HOST');
const idb_port =  IBMCloudEnv.getString('DBC_PORT');
const idb_prot =  IBMCloudEnv.getString('DBC_PROT');
const idb_dbnm =  IBMCloudEnv.getString('DBC_NAME');
const idb_dbusr =  IBMCloudEnv.getString('DBC_USERNAME');
const idb_dbpsw =  IBMCloudEnv.getString('DBC_PSW');

// класс управления базой данных
var couchdb ;
// конфигурация подклчения у БД
var dbopts = null ;
// обьект  БД
var dbo = null ;

// Ключи для хранения специфических документов=справочников

// Ключ документа, для хранения схемы
var dbkey_schema = 'id_schema';

/**
 * клас управления CouchDB
 */
var couchdbSrvc = {

	/**
	 * Подключение к сервису БД
	 * Прочитывает конфигурацию и возвращает  обьек-сервис базы данных
	 * @param {*} app  - @@see server/server.js
	 * @param {*} serviceManager   - @@server/service/service-manager.js 
	 *                               возвращает массив нужных классов 
	 */ 
	init: function (app, serviceManager) {
			//http://admin:mypassword@localhost:5984
			const opts = {
				url: idb_prot+'://'+idb_dbusr+':'+idb_dbpsw+'@'+idb_host+':'+idb_port ,
				db: idb_dbnm
			} ;
			dbopts = opts ;

			logger.info('couch-db.CreateService');
			couchdb = require('nano')(opts);

			serviceManager.set('couchdb', couchdb );
			logger.info('couch-db.CreateService-OK');

	},
    /**
	 * Получить обьект БД
	 * @returns {ok:  success-true, failure-false, 
	 *           errtext: текст ошибки,
	 *           db: обьект БД}
	 */
	dbGetDatabase: function() {
		var reso={ok: true, errtext: null,db: null};
		if (typeof dbo === "undefined"){
			reso.ok = false ;
			reso.errtext = 'dbo object is undefined!' ;
			return reso  ;
		} else if ( dbo === null){
			reso.ok = false ;
			reso.errtext = 'db is null!';
			return reso  ;
		} else {
			reso.ok = true ;  
			reso.db = dbo ;
			return reso  ;
		}     
	},

	/**
	 * Подключение к БД
	 */
	dbConnect: function() {
            // return obj 
		    var reso={ok: true, isdbcreated: false, dbname: dbopts.db };
			return new Promise(function (resolve, reject) {
				couchdb.db.get( dbopts.db , function (err, body) {
					if (err) {
						logger.info('Database: ['+dbopts.db+']'+ ' does not exists! It will be created!');
						couchdb.db.create( dbopts.db, function (err, body) {
							if (err) {
								reject("Failed to create database: " + err);
							} else {
								dbo = couchdb.use(dbopts.db);
								logger.info('Database: ['+dbopts.db+']'+ ' has created');
								reso.isdbcreated=true;
								resolve( reso );
							}	
						});			
					} else {
						dbo = couchdb.use( dbopts.db );
						logger.info('Database: ['+dbopts.db+']'+ ' has existed');
						resolve( reso );
					}
				});
			});
	},

	/**
	 * Деинициализация сервиса (типа отключение от БД)
	 */
	dbClose: function() {
		var reso={ok: true};
		couchdb = null ;
		dbo = null;
		return reso ;
	},
	
	/**
	 * Возвращает следующий уникальный id для документа в БД
	 * @param {*} ids  -  количество id, которые нужно сгенерировать
	 * 
	 * Пример оригинального вызова в API
	 *    nano.uuids(3).then( (doc) => {console.log(doc);}  );
	 * 
	 * @return  
	 * { ok: true,
     *   uuids: [ 'e9b10bfa8734d93962a194b061002fc0',
     *            'e9b10bfa8734d93962a194b061003cfa',
     *            'e9b10bfa8734d93962a194b061004b21' 
	 *           ] 
	 * }
	 * 
	 */
	dbNextId: function( p_ids ){
		// return obj 
		var reso={ok: true, uuids: null};
		var lids ;
    
		return new Promise(function(resolve, reject) {
			if (typeof p_ids === "undefined"){
				lids = 1;
			} else if ( p_ids === null){
				lids = 1;
			} else {
				lids = p_ids;
			};
			couchdb.uuids(lids, function (err, doc){
				if (err){
					logger.error('Error while initializing DB: ' + err.message, '!!!');
					reject(err) ;
				} else {
					reso.ok = true;
					reso.uuids = doc.uuids;
					resolve(  reso );
				};

			});
		});
	},

	/**
	 * Создание документа в DB
	 * 
	 * @param {*} p_doc 
	 * 
	 * @return {*} osbject
	 * { ok: true,
     *   id: 'rabbit',
     *   rev: '1-6e4cb465d49c0368ac3946506d26335d'
	 * }
	 * 
	 * 
	 */
	dbInsert: function( p_doc ){
		// return obj 
		var reso={ok: true};
		var ldbdoc ;
    
		return new Promise(function(resolve, reject) {
			if (typeof p_doc === "undefined"){
				err = new Error('p_doc is undefined');
				reject(  err   );
			} else if ( p_doc === null){
				err = new Error('p_doc is null');
				reject(  err   );
			} else {
				ldbdoc = p_doc;
			};
			dbo.insert( ldbdoc , function (err, doc){
				if (err){
					logger.error('Error while initializing DB: ' + err.message, '!!!');
					reject(err) ;
				} else {
					reso.ok = doc.ok;
					reso.id = doc.id;
					reso.rev= doc.rev;
					resolve(  reso );
				};

			});
		});
	},

	/**
	 * Удалить документ
	 * @param {*} p_id - id документа
	 * @param {*} p_rev - ревизия документа
	 */
	dbDelete: function( p_id, p_rev ){
		// return obj 
		var reso={ok: true};
		var ldb_id ;
		var ldb_rev;
    
		return new Promise(function(resolve, reject) {
			if (typeof p_id === "undefined"){
				err = new Error('p_id is undefined');
				reject(  err   );
			} else if ( p_id === null){
				err = new Error('p_id is null');
				reject(  err   );
			} else {
				ldb_id = p_id;
			};

			ldb_rev = p_rev ;
			dbo.destroy( ldb_id, ldb_rev , function (err, doc){
				if (err){
					logger.error('Error while initializing DB: ' + err.message, '!!!');
					reject(err) ;
				} else {
					reso.ok = doc.ok;
					reso.id = doc.id;
					reso.rev= doc.rev;
					resolve(  reso );
				};

			});
		});
	

	},
	
	dbGetDoc: function( p_id, p_rev ){
		var reso={ok: true};
        return new Promise(function(resolve, reject) {
			dbo.get( p_id , function (err, doc){
				if (err){
					logger.error('Error while nano.get DB: ' + err.message, '!!!');
					reject(err) ;
				} else {
					reso.ok = true;
					reso.rdata = doc;
					
					resolve(  reso );
				};

			});


		});
	},	
    /**
	 * 
	 */
	dbSelect: function( p_selector ){
		var reso={ok: true};
        return new Promise(function(resolve, reject) {
			dbo.find( p_selector , function (err, doc){
				if (err){
					logger.error('Error while nano.find DB: ' + err.message, '!!!');
					reject(err) ;
				} else {
					reso.ok = true;
					reso.rdata = doc;
					
					resolve(  reso );
				};

			});


		});
	},
	/**
	 * 
	 * @param {object} p_docs 
	 *          {docs:i_documents}
	 *                i_documents = [{}, {}, {}] 
	 */
	dbBulk: function( p_docs ){
		var reso={ok: true};
        return new Promise(function(resolve, reject) {
			dbo.bulk( p_docs , function (err, doc){
				if (err){
					logger.error('Error while nano.find DB: ' + err.message, '!!!');
					reject(err) ;
				} else {
					reso.ok = true;
					reso.rdata = doc;
					
					resolve(  reso );
				};

			});


		});
	},

	/**
	 * 
	 */
	dbCreateIdx: function( p_idx ){
		var reso={ok: true};
        return new Promise(function(resolve, reject) {
			dbo.createIndex( p_idx , function (err, doc){
				if (err){
					logger.error('Error while nano.find DB: ' + err.message, '!!!');
					reject(err) ;
				} else {
					reso.ok = true;
					reso.rdata = doc;
					
					resolve(  reso );
				};

			});
		});
	},




	/**
	 * Добавить схему рабора XLS в DB
	 * 
	 * @param {*} p_doc 
	 * 
	 * @return {*} osbject
	 * { ok: true,
     *   id: 'rabbit',
     *   rev: '1-6e4cb465d49c0368ac3946506d26335d'
	 * }
	 * 
	 * 
	 */
	/*
	dbUploadSchema: function( p_schema ){
		// return obj 
		var reso={ok: true};

		var ldb_schema = p_schema ;
		var ldb_key = dbkey_schema ;
    
		return new Promise(function(resolve, reject) {
			if (typeof ldb_schema === "undefined"){
				err = new Error('ldb_schema is undefined');
				reject(  err   );
			} else if ( ldb_schema === null){
				err = new Error('p_doc is null');
				reject(  err   );
			} else {
				// ok  продолжаем обработку
			};

            dbo.get(ldb_key,  function( err , doc){
				if (err){
					logger.error('Error while Getting Schema doc: ' + err.message, '!!!');
					//reject(err) ;
					dbo.insert( { _id: ldb_key, schema: ldb_schema } , function( err , doc){
						if (err){
							logger.error('Error while initializing DB: ' + err.message, '!!!');
							reject(err) ;
						} else {
							reso.ok = doc.ok;
							reso.id = doc.id;
							reso.rev= doc.rev;
							resolve(  reso );
						};
					});

				} else {
					reso.ok = doc.ok;
					reso.id = doc._id;
					reso.rev= doc._rev;
					dbo.insert( { _id: ldb_key, rev: doc._rev, schema: ldb_schema } , function( err , doc){
					if (err){
							logger.error('Error while initializing DB: ' + err.message, '!!!');
							reject(err) ;
					} else {
							reso.ok = doc.ok;
							reso.id = doc.id;
							reso.rev= doc.rev;
							resolve(  reso );
					};

					//resolve(  reso );
				};
			})

		});
	},
	*/	

};
// end:  couchdbSrvc

module.exports = couchdbSrvc ;
