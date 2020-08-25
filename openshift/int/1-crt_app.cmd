@echo off

echo **************************************************************
echo *            CREATE APP IN OPENSHIFT
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
call ..\prj_env.cmd %BUILD_ENV%
call ..\login
IF %ERRORLEVEL% NEQ 0 ( 
   goto l_wrkerr 
)

oc project %PRJ-NAME%
IF %ERRORLEVEL% NEQ 0 ( 
   goto l_wrkerr 
)


call %2 
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

pause