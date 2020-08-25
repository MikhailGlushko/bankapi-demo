echo ****************************************
echo *    create CouchDB
echo * 
echo *    ./couchdb.env  - contains database admin and password
echo *    docker pull ibmcom/couchdb3
echo *    https://hub.docker.com/r/ibmcom/couchdb3
echo *    иммитация --output=yaml --dry-run
echo ****************************************

oc delete all -l app=couchdb1
oc create -f crt_app_couchdb.yaml 

