@echo off
CHCP 65001
echo **************************************************************
echo *            DELETE PROJECT ON OPENSHIFT
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





oc delete project %PRJ-NAME%
IF %ERRORLEVEL% NEQ 0 ( 
   goto l_wrkerr 
)

oc get projects

goto l_exit

:l_wrkerr
echo  ===================================================
echo  ******** ERRRRRROOOOORRRRRR !!! *******************
echo  *                                                 *
echo  *       DELETE project error                      *
echo  *                                                 *
echo  ===================================================


:l_exit
