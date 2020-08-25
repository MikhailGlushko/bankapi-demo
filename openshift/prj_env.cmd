echo ============================================================================
echo SET  Evironment variables for project
echo ============================================================================



if "%1" == "" (
   echo ===========================================
   echo Environment name is reqired
   echo You can use dev int prod  
   echo ===========================================
   pause
   goto l_exit
)   
set BUILD_ENV=%1

echo SET Project parameters

   set PRJ-NAME=bnkdem
   set PRJ-DISP=bnkdem
   set PRJ-DESCR=bnkdem
echo SET ENV marker
   set PRJ-NAME=%PRJ-NAME%-%BUILD_ENV%
   set PRJ-DISP=%PRJ-DISP%-%BUILD_ENV%
   set PRJ-DESCR=%PRJ-DESCR%-%BUILD_ENV%

:l_exit
set PRJ-NAME
set PRJ-DISP
set PRJ-DESCR
