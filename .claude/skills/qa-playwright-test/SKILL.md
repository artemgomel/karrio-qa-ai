---
name: qa-playwright-test
description: Write or extend Playwright TypeScript tests in this repository following its architecture (fixtures, page objects, API data setup). Use when asked to automate a test case.
---

# Автоматизация теста в этом репозитории

## Архитектура (соблюдать обязательно)

- `src/api/karrio-client.ts` — API-клиент. Данные для тестов готовятся **только через API**.
- `src/fixtures.ts` — фикстуры. Новая подготовка данных → новая фикстура, а не код в тесте.
- `src/pages/*.page.ts` — page objects. Локаторы живут только здесь.
- `src/data/test-data.ts` — билдеры тестовых данных.
- `tests/api` — бизнес-правила; `tests/ui` — только отображение и сверка UI с API.
- Теги: `@smoke` — критичный путь; `@mobile` — тест также идёт в мобильной эмуляции.

## Шаги

1. Определи уровень (API или UI) по правилам из скилла `qa-test-design`.
2. Если нужен UI — открой страницу через Playwright MCP, посмотри accessibility-дерево
   и выбери локатор по приоритету: `getByRole` → `getByLabel` → `getByText` → `name`/`data-testid`. Никаких XPath и CSS-цепочек по классам.
3. Напиши тест: arrange через фикстуры, act, assert. Один тест — одна проверка поведения.
4. Запусти: `npx playwright test <файл> --project=<проект>`.
5. Если упал — разбери trace (`npx playwright show-trace`) и исправь причину, а не добавляй `waitForTimeout`.

## Запрещено
- `page.waitForTimeout`, жёсткие паузы.
- Подготовка данных кликами в UI.
- Захардкоженные значения, которые можно взять из API или `DEMO_CARRIER`.
- Отключать тест вместо исправления. Известный баг — `test.fail()` + аннотация `issue`.
