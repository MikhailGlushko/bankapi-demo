@echo off
 CHCP 65001

echo **************************************************************
echo *            CREATE PROJECT ON OPENSHIFT
echo **************************************************************

if "%1" == "" (
   echo ===========================================
   echo Environment name is reqired
   echo You can use: dev int prod  
   echo ===========================================
   pause
   goto l_exit
)   
set BUILD_ENV=%1

echo set project and login
call prj_env.cmd %BUILD_ENV%
call login
IF %ERRORLEVEL% NEQ 0 ( 
   goto l_wrkerr 
)




echo create project
oc new-project %PRJ-NAME% --description="%PRJ-DESCR%" --display-name="%PRJ-DISP%"
IF %ERRORLEVEL% NEQ 0 ( 
   goto l_wrkerr 
)

oc get projects
IF %ERRORLEVEL% NEQ 0 ( 
   goto l_wrkerr 
)

oc project %PRJ-NAME%
IF %ERRORLEVEL% NEQ 0 ( 
   goto l_wrkerr 
)


echo ************************************
echo *  create secrets
echo ************************************

call crt_prj_secret.cmd
IF %ERRORLEVEL% NEQ 0 ( 
   goto l_wrkerr 
)

echo ************************************
echo *  grant access to developers
echo ************************************
call grn_prj_opshift.cmd 
IF %ERRORLEVEL% NEQ 0 ( 
   goto l_wrkerr 
)


goto l_exit
:l_wrkerr
echo  ===================================================
echo  ******** ERRRRRROOOOORRRRRR !!! *******************
echo  *                                                 *
echo  *       Create project error                      *
echo  *                                                 *
echo  ===================================================


:l_exit

