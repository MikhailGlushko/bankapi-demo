echo ****************************************
echo *    create IBM  Secure GateWay
echo * 
echo *    ./securegw.env  - contains database admin and password
echo *    docker pull ibmcom/secure-gateway-client
echo *   
echo ****************************************

oc delete all -l app=securegw
oc new-app --docker-image=ibmcom/secure-gateway-client method=new-app --name securegw --env-file ./securegw.env -l app=securegw

echo ****************************************
echo *    create securegw client Router
echo * 
echo ****************************************


oc expose svc/securegw --hostname="sgw-bnkdem-dev.apps-crc.testing" --name="sgw-bnkdem-dev.apps-crc.testing" --port 9003 -l app=securegw
