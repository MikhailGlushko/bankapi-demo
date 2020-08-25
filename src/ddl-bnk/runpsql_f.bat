@echo off
rem CHCP 65001
REM Copyright (c) 2012-2020, EnterpriseDB Corporation.  All rights reserved


ECHO ===================BEFORE RUN SCRIPT =======================
ECHO for openshift: oc login --token=[ your token ]  --server=https://api.crc.testing:6443
ECHO for openshift: oc port-forward [pod] 15432:5432

REM PostgreSQL server psql runner script for Windows

ECHO =====SET CLIENT CONSOLE UTF-8
ECHO SET client_encoding = 'UTF8';
ECHO =============================

REM PostgreSQL server psql runner script for Windows

SET server=localhost
SET /P server="Server [%server%]: "

SET database=bnkdb
SET /P database="Database [%database%]: "

SET port=15432
SET /P port="Port [%port%]: "

SET username=devadm
SET /P username="Username [%username%]: "

   for /f "delims=" %%a in ('chcp ^|find /c "932"') do @ SET CLIENTENCODING_JP=%%a
   if "%CLIENTENCODING_JP%"=="1" SET PGCLIENTENCODING=SJIS
   if "%CLIENTENCODING_JP%"=="1" SET /P PGCLIENTENCODING="Client Encoding [%PGCLIENTENCODING%]: "

rem SET PGCLIENTENCODING=65001
rem SET /P PGCLIENTENCODING="Client Encoding [%PGCLIENTENCODING%]: "

REM Run psql
"C:\Program Files\PostgreSQL\12\bin\psql.exe" -h %server% -U %username% -d %database% -p %port% -f %1%

pause

