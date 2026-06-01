# Gym Tracker

Приложение для отслеживания абонементов в спортзал. Создавайте абонементы, отмечайте посещения и следите за прогрессом — всё хранится локально в браузере.

## Возможности

- **Абонементы** — создание с названием, количеством занятий и датой начала
- **Посещения** — отметка и удаление визитов с датой и временем
- **Прогресс** — прогресс-бар с оставшимся количеством занятий
- **История** — таймлайн посещений на детальной странице абонемента
- **Локальное хранение** — данные в localStorage, никаких серверов
- **PWA** — работает офлайн, можно установить на домашний экран
- **Адаптивный дизайн** — mobile-first, удобно на любом устройстве

## Как использовать

1. На главной странице нажмите **«Новый абонемент»**
2. Укажите название, количество занятий и дату начала
3. Нажимайте **«Отметить посещение»**, чтобы фиксировать тренировки
4. Отслеживайте прогресс по шкале на каждой карточке
5. Нажмите на карточку, чтобы увидеть детальную историю посещений

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

Приложение автоматически деплоится на GitHub Pages при создании релиза через CI/CD:

1. **Release-Please** — при пуше в `main` с [conventional commits](https://www.conventionalcommits.org/) создаёт release PR с CHANGELOG и версией
2. **GitHub Actions** — при мерже release PR автоматически публикуется GitHub Release с git-тегом `vX.Y.Z` и запускается деплой на GitHub Pages

Приложение доступно по адресу: [basilred.github.io/gym-tracker](https://basilred.github.io/gym-tracker)

### Настройка

1. В настройках репозитория (`Settings → Pages → Build and deployment`) должен быть выбран источник **GitHub Actions**.
2. В `Settings → Actions → General → Workflow permissions` включите **«Allow GitHub Actions to create and approve pull requests»** — это необходимо для автоматического создания release PR.

## Структура проекта

```
src/
├── components/
│   ├── NewSubscriptionForm.jsx   # Форма создания абонемента
│   ├── SubscriptionCard.jsx      # Карточка в списке
│   ├── SubscriptionDetail.jsx    # Детальная страница абонемента
│   ├── SubscriptionList.jsx      # Список всех абонементов
│   └── VisitTimeline.jsx         # Таймлайн посещений
├── hooks/
│   └── useSubscriptions.js       # CRUD-операции с localStorage
├── pages/
│   ├── Home.jsx                  # Главная страница
│   └── SubscriptionPage.jsx      # Страница одного абонемента
├── App.jsx                       # Роутинг приложения
├── App.css                       # Глобальные стили
├── index.css                     # Сброс и базовые стили
└── main.jsx                      # Точка входа
```

## Лицензия

MIT
