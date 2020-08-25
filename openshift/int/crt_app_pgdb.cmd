echo ****************************************
echo *    create Postgres DB from template
echo * 
echo ****************************************

oc delete all -l app=postgresql2
oc create -f crt_app_pgdb.yaml  



echo ****************************************
echo *    Router не нуже БД работает по своему протоколу
echo *    Нужно сделать port forward для работы с psql
echo *    oc port-forward postgresql-1-97dtc 15432:5432
echo * 
echo ****************************************


