---
name: qa-failure-triage
description: Triage failed Playwright tests after a run. Classifies each failure as product bug, test bug, flaky or environment, and drafts a bug report. Use after a red test run in CI or locally.
---

# Разбор упавших тестов

## Входные данные
- `test-results/results.json` — JSON-отчёт Playwright.
- Для каждого упавшего теста: `test-results/<тест>/` (trace.zip, скриншот, видео).
- Логи API Karrio: `docker logs karrio.api --tail 200` (если доступен Docker).

## Шаги

1. Из `results.json` собери список упавших и flaky тестов (status `failed` / `flaky`).
2. Для каждого определи категорию:
   - **Product bug** — поведение противоречит требованиям в `docs/requirements`.
   - **Test bug** — устаревший локатор, неверные данные, ошибка в ожидании.
   - **Flaky** — прошёл на ретрае, зависит от тайминга или порядка тестов.
   - **Environment** — стенд недоступен, 5xx, таймаут подключения.
3. Подтверди категорию фактами: текст ошибки, шаг в trace, ответ API. Без фактов — пометь «нужна проверка».
4. Сгруппируй падения с одной причиной.

## Формат ответа

Таблица: `Тест | Категория | Причина (1 строка) | Доказательство | Действие`

Для каждого Product bug — черновик баг-репорта:
Заголовок, Шаги, Ожидаемый результат (со ссылкой на REQ-*), Фактический результат, Окружение, Вложения.

## Правила
- Не чини продукт и не меняй ожидания тестов под фактическое поведение без подтверждения требований.
- Test bug можно сразу предложить исправить (diff).
