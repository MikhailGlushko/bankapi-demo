@echo off

echo **************************************************************
echo *            Login script on OPENSHIFT
echo **************************************************************
echo * oc login --server%OC_URL% --token=%OC_TOKEN%
echo * oc login --server%OC_URL% -u %OC_USER% -p %OC_PSW%
echo **************************************************************

rem set OC_URL=https://api.crc.testing:6443
rem set OC_TOKEN=

echo *************************************************************
echo * Openshift CLI URL=%OC_URL%
echo ************************************************************* 

rem oc login --server%OC_URL% --token=%OC_TOKEN%

oc login --token=[your token] --server=https://api.crc.testing:6443