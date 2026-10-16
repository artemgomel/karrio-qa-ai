# karrio-qa-ai

Демо AI-augmented QA процесса на открытой логистической платформе
[Karrio](https://github.com/karrioapi/karrio) (тарифы перевозчиков, отправления, этикетки, трекинг).

Стек: **Playwright + TypeScript**, Claude Code со скиллами и Playwright MCP, GitHub Actions.

## Что внутри

```
.claude/skills/          скиллы Claude для QA-процесса
  qa-requirements-review   ревью требований → вопросы аналитику
  qa-test-design           тест-кейсы с приоритетами и уровнями API/UI/Manual
  qa-playwright-test       автоматизация по правилам архитектуры проекта
  qa-failure-triage        классификация падений + черновики баг-репортов
CLAUDE.md                правила проекта для AI
.mcp.json                Playwright MCP (AI видит и кликает UI)
docs/requirements/       постановка фичи (вход для AI-анализа)
docs/video-script.md     сценарий демонстрации
src/
  api/                   API-клиент Karrio (подготовка данных, сверка с UI)
  pages/                 page objects
  data/                  билдеры тестовых данных
  fixtures.ts            фикстуры как композиция
tests/
  setup/                 логин + тестовый перевозчик и тарифная сетка (идемпотентно)
  api/                   бизнес-правила: тарифы, лимиты, статусы
  ui/                    отображение и сверка UI с API (desktop + mobile)
.github/workflows/       регресс в CI: поднимает Karrio в Docker и гоняет проекты параллельно
```

## Запуск

1. Поднять Karrio (рядом в папке `../karrio`):
   ```bash
   cd ../karrio/docker && docker compose up -d
   ```
   Dashboard: http://localhost:3002 (admin@example.com / demo), API: http://localhost:5002.
2. Установить зависимости:
   ```bash
   npm install
   npx playwright install chromium
   cp .env.example .env
   ```
3. Запустить:
   ```bash
   npm test            # всё
   npm run test:api    # быстрый API-слой
   npm run test:ui     # UI desktop + mobile
   npm run test:smoke  # критичный путь
   npm run report      # HTML-отчёт
   ```

## Тестовые данные

Реальные аккаунты перевозчиков не нужны: `tests/setup/data.setup.ts` создаёт
**Generic carrier** «Demo Logistics» и тарифную сетку (США, 15 USD, 3 дня, до 30 кг).
Сетап идемпотентный — повторный запуск ничего не дублирует.

## Найдено в процессе

| ID | Находка | Как найдено |
|----|---------|-------------|
| KQA-1 | Нет тарифов (вес > 30 кг, адрес вне зоны) → пустой список без объяснения причины (REQ-RATE-05) | AI-ревью требований + граничные тесты |
| KQA-2 | `POST /v1/connections` молча игнорирует неизвестное поле `services` и возвращает 201 | Исследование API, сверка с исходниками |
| Q-1 | Повторная отмена отправления возвращает 202 — требования не описывают ожидаемое поведение | API-тест, вопрос аналитику |
