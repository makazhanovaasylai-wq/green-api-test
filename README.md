# GREEN-API Test Assignment

Одностраничное приложение для демонстрации вызовов WhatsApp API GREEN-API.

## Реализованные методы

- `getSettings`
- `getStateInstance`
- `sendMessage`
- `sendFileByUrl`

## Запуск

Проект не требует сборки или установки зависимостей.

Можно открыть `index.html` в браузере либо разместить репозиторий через GitHub Pages.

Для работы API необходимо:

1. Создать инстанс в GREEN-API.
2. Авторизовать WhatsApp-номер через QR-код.
3. Получить `idInstance` и `ApiTokenInstance`.
4. Ввести их на странице.

## Структура

```text
green-api-test/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Важно

`ApiTokenInstance` используется на клиентской стороне только потому, что это предусмотрено тестовым заданием. Для production-приложения секретный токен не следует публиковать в frontend-коде; запросы лучше проксировать через backend.

## API

Официальная документация GREEN-API:
https://green-api.com/docs/
