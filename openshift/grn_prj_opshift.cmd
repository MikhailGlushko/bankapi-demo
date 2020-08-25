echo ****************************************
echo * Прдоставить другому разработчику права администратора проекта 
echo * 
echo ****************************************


rem oc adm policy add-role-to-user admin USERNAME -n %PRJ-NAME%



rem  *****   просмотр прав на проект  ********
rem  oc describe rolebinding.rbac -n [project]




