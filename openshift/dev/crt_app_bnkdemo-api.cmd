echo ****************************************
echo *    create bnkdemo-api
echo * 
echo ****************************************
rem --output=yaml --labels=":latest"
oc delete all -l app=bnkdemo-api
oc new-app https://github.com/pavlo-shcherbukha/bnkapidemo.git#master --context-dir=/src/bnkdemo-be  --name="bnkdemo-api" --env-file ./bnkdemo-api.env --strategy=source --source-secret=sinc-github --image-stream=openshift/nodejs:10-SCL -l app=bnkdemo-api

echo ****************************************
echo *    create bnkdemo-api Router
echo * 
echo ****************************************
oc expose svc/bnkdemo-api --hostname="bnkapi-bnkdem-dev.apps-crc.testing" --name="bnkapi-bnkdem-dev.apps-crc.testing" --port 8080 -l app=bnkdemo-api
