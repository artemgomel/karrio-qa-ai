# karrio-qa-ai — правила для AI-ассистента

Проект: автотесты Playwright + TypeScript для платформы доставки Karrio (локальный стенд в Docker).

## Стенд
- Dashboard: http://localhost:3002, API: http://localhost:5002 (см. `.env.example`).
- Исходники Karrio лежат рядом: `../karrio` — используй их, чтобы проверять поведение и API, а не угадывать.
- Тестовый перевозчик и тарифы создаёт `tests/setup/data.setup.ts` (Generic carrier + rate sheet).

## Команды
- `npm test` — всё; `npm run test:api`; `npm run test:ui`; `npm run test:smoke`.
- `npm run typecheck` — перед коммитом.

## Процесс QA с AI
1. Требования → скилл `qa-requirements-review` → вопросы аналитику.
2. Тест-кейсы → скилл `qa-test-design` → таблица с уровнями API/UI/Manual.
3. Автоматизация → скилл `qa-playwright-test` (+ Playwright MCP для UI).
4. Падения → скилл `qa-failure-triage`.

## Правила
- Человек ревьюит всё, что сгенерировано. AI предлагает, QA решает.
- Архитектуру и запреты см. в `.claude/skills/qa-playwright-test/SKILL.md`.
- Не коммить `.env`, `playwright/.auth`, отчёты.
