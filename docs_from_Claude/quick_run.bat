# Клонирование и настройка
git clone <repository-url>
cd jsonplaceholder-api-testing
make setup

# Запуск smoke тестов (1-2 минуты)  
make test-smoke

# Запуск всех тестов
make test

# Генерация отчетов
make report-open

# Docker execution
make docker-test