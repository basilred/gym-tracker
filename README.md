# Gym Tracker

Приложение для отслеживания абонементов в спортзал. Создавайте абонементы, отмечайте посещения и следите за прогрессом — всё хранится локально в браузере.

## Возможности

- **Абонементы** — создание с названием, количеством занятий и датой начала
- **Посещения** — отметка визитов с датой и временем, редактирование даты, удаление через swipe
- **Прогресс** — прогресс-бар с оставшимся количеством занятий
- **История** — таймлайн посещений на детальной странице абонемента
- **Тёмная тема** — автоматическое переключение по системным настройкам
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
- [TypeScript](https://www.typescriptlang.org/) (strict-режим)
- [Vite 7](https://vite.dev/)
- [React Router v7](https://reactrouter.com/)
- [БЭМ-методология](https://ru.bem.info/) + CSS custom properties
- [FSD-light](https://feature-sliced.design/) — группировка кода по доменам
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)
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

# Запуск тестов
npm test

# Запуск тестов с отчётом покрытия
npm run test:coverage
```

## Деплой

Приложение автоматически деплоится на GitHub Pages при создании релиза через CI/CD:

1. **Release-Please** — при пуше в `master` с [conventional commits](https://www.conventionalcommits.org/) создаёт release PR с CHANGELOG и версией
2. **GitHub Actions** — при мерже release PR автоматически публикуется GitHub Release с git-тегом `vX.Y.Z` и запускается деплой на GitHub Pages

Приложение доступно по адресу: [basilred.github.io/gym-tracker](https://basilred.github.io/gym-tracker)

### Настройка

1. В настройках репозитория (`Settings → Pages → Build and deployment`) должен быть выбран источник **GitHub Actions**.
2. В `Settings → Actions → General → Workflow permissions` включите **«Allow GitHub Actions to create and approve pull requests»** — это необходимо для автоматического создания release PR.

## Структура проекта

Проект организован по методологии **FSD-light** (Feature-Sliced Design): код группируется по доменам, а не по техническим слоям.

```
src/
├── app/                          # Настройки, роутинг, точка входа
│   ├── App.tsx                   # Роутер с ErrorBoundary-обёрткой
│   └── main.tsx                  # Точка входа
├── pages/                        # Композиция страниц из виджетов и фич
│   ├── home/                     # Главная страница
│   └── subscription-page/       # Страница одного абонемента
├── widgets/                      # Самодостаточные блоки UI
│   ├── subscription-card/        # Карточка абонемента в списке
│   ├── subscription-detail/      # Детальная страница с прогрессом
│   ├── subscription-list/        # Список всех абонементов
│   └── visit-timeline/           # Таймлайн посещений со свайпом
├── features/                     # Пользовательские действия
│   ├── create-subscription/      # Форма создания абонемента
│   └── mark-visit/               # Кнопка отметки посещения
├── entities/                     # Бизнес-сущности
│   └── subscription/
│       ├── types.ts              # TypeScript-интерфейсы
│       └── lib/
│           ├── calcProgress.ts   # Расчёт прогресса
│           └── useSubscriptions.ts # CRUD-операции с localStorage
└── shared/                       # Переиспользуемое без бизнес-логики
    ├── ui/ErrorBoundary/         # Предохранитель с retry
    └── styles/tokens.css         # Дизайн-токены (светлая и тёмная темы)
```

## Лицензия

MIT
