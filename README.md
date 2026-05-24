# Gym Tracker

Приложение для отслеживания абонементов в спортзал. Позволяет создавать абонементы, фиксировать посещения и следить за оставшимся количеством занятий.

## Возможности

- Создание абонементов с названием, количеством занятий и датой начала
- Отметка посещений по каждому абонементу
- Прогресс-бар с количеством оставшихся занятий
- История посещений с датой и временем
- Данные хранятся локально в браузере (localStorage)
- PWA — работает офлайн после первой загрузки
- Адаптивный дизайн (mobile-first)

## Технологии

- [React 19](https://react.dev/)
- [Vite 7](https://vite.dev/)
- [React Router v7](https://reactrouter.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки (http://localhost:5173)
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр собранного приложения
npm run preview

# Линтинг
npm run lint
```

## Деплой

Приложение развёрнуто на GitHub Pages: https://basilred.github.io/gym-tracker

```bash
# Деплой на GitHub Pages
npm run deploy
```

## Структура проекта

```
src/
├── components/
│   ├── NewSubscriptionForm.jsx   # Форма создания нового абонемента
│   ├── SubscriptionCard.jsx      # Карточка абонемента в списке
│   ├── SubscriptionDetail.jsx    # Детальная страница абонемента
│   ├── SubscriptionList.jsx      # Список всех абонементов
│   └── VisitTimeline.jsx         # Таймлайн посещений
├── hooks/
│   └── useSubscriptions.js       # Хук для работы с абонементами (CRUD + localStorage)
├── pages/
│   ├── Home.jsx                  # Главная страница со списком
│   └── SubscriptionPage.jsx      # Страница конкретного абонемента
├── App.jsx                       # Роутинг
├── App.css
├── index.css
└── main.jsx                      # Точка входа
```

## Лицензия

MIT
