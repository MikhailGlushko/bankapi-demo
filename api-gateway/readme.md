# bnkapi - Построение multicloud  CloudNative приложений на платформе OpenShift. Интеграция с IBM Cloud. API-GateWay


<!-- TOC BEGIN -->
- 1. [API Gateway - для чего он нужен](#p1)
- 2. [Шаги по развертыванию API ](#p2)
- 3. [tbd](#p3)



<!-- TOC END -->


<a name="p1"></a>
## API Gateway - для чего он нужен

IBM® Cloud API Gateway - это бесплатная служба, которую вы можете использовать для создания, защиты, совместного использования и управления API-интерфейсами, которые обращаются к ресурсам IBM Cloud.

API Gateway работает, вставляя быстрый и легкий шлюз перед существующими end-points IBM Cloud. Шлюз перехватывает входящий вызов API и выполняет политики безопасности, а затем направляет вызов во внутреннее приложение. После обработки запроса фоновое приложение отправляет ответ шлюзу, который затем направляет его обратно вызывающей стороне.




<a name="p2"></a>
## Шаги по развертыванию Secure Gateway

Для развертываня необходимо выполнитьтакие ряд шагов.

- В каталоге IBM Cloud в разделе сервисы-интеграция найти продукт: pic-1
 <kbd><img src="doc/ap-pic-1.png" /></kbd>
<p style="text-align: center;">pic-1</p>

- Выполнить инсталляцию сервиса в своем облачном account: pic-2.

 <kbd><img src="doc/ap-pic-2.png" /></kbd>
<p style="text-align: center;">pic-2</p>

В реальности API-GateWay объединяет в себе несколько продуктов. На pic-3 кратко отмечены самые интересные.

 <kbd><img src="doc/ap-pic-3.png" /></kbd>
<p style="text-align: center;">pic-3</p>

- Создадим API Proxy
 <kbd><img src="doc/ap-pic-4.png" /></kbd>
<p style="text-align: center;">pic-4</p>

На pic-5 показано уже создано 5 API.

 <kbd><img src="doc/ap-pic-5.png" /></kbd>
<p style="text-align: center;">pic-5</p

 Для создания API  нужно загрузить swagger.json (swagger.yaml)  с формальным описание API. Указать base path  и указать url endpoint

>

- Получить GateWay ID и Security Token и внести их в настройки клиента: pic-6
 <kbd><img src="doc/ap-pic-6.png" /></kbd>
<p style="text-align: center;">pic-6</p>


Сразу же после создания API  его можно протестировать: pic-7. А потом установить желаемые настройки безопасности.
 <kbd><img src="doc/ap-pic-7.png" /></kbd>
<p style="text-align: center;">pic-7</p>
