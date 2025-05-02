include .env
export $(shell sed 's/=.*//' .env)
COMPOSE_RUN=docker-compose run --rm

MYSQL_URL=mysql://$(DB_USERNAME):$(DB_PASSWORD)@$(DB_HOST):$(DB_PORT)/$(DB_NAME)
MYSQL_DEV_URL=mysql://$(DB_USERNAME):$(DB_PASSWORD)@$(DB_DEV_HOST):$(DB_PORT)/$(DB_NAME)

MYSQL_LOCAL_URL=mysql://$(DB_USERNAME):$(DB_PASSWORD)@maindb:3306/$(DB_NAME)
MYSQL_LOCAL_DEV_URL=mysql://$(DB_USERNAME):$(DB_PASSWORD)@maindb-dev:3306/$(DB_NAME)

.PHONY: up down hash migrate diff generate-schema-doc generate-page-doc generate-doc migrate-generate-doc clean help

outputFormat=png

up:
	docker-compose up -d

start:
	docker-compose start

stop:
	docker-compose stop

down:
	docker-compose down

start-db:
	docker-compose start maindb maindb-dev dynamodb

seed-maindb:
	npm run seed:run

migrate-maindb:
	atlas migrate apply --dir file://misc/database/migrations --url $(MYSQL_URL)

migrate-maindb-local:
	$(COMPOSE_RUN) atlas migrate apply --dir file:///migrations --url $(MYSQL_LOCAL_URL)

diff-maindb:
	atlas migrate diff --to file://misc/database/schema.hcl --dir file://misc/database/migrations --dev-url $(MYSQL_DEV_URL)
	atlas migrate hash --dir file://misc/database/migrations

diff-maindb-local:
	$(COMPOSE_RUN) atlas migrate diff --to file:///schema.hcl --dir file:///migrations --dev-url $(MYSQL_LOCAL_DEV_URL)
	$(COMPOSE_RUN) atlas migrate hash --dir file:///migrations

rollback-maindb-local:
	$(COMPOSE_RUN) atlas migrate down --dir file:///migrations --url $(MYSQL_LOCAL_URL) --dev-url $(MYSQL_LOCAL_DEV_URL)

re-hash-maindb:
	atlas migrate hash --dir file://misc/database/migrations

re-hash-maindb-local:
	$(COMPOSE_RUN) atlas migrate hash --dir file:///migrations

generate-graph-maindb-local:
	$(COMPOSE_RUN) -e JAVA_TOOL_OPTIONS="$(JAVA_TOOL_OPTIONS)" schemacrawler /opt/schemacrawler/bin/schemacrawler.sh \
		--server mysql \
		--host maindb \
		--port 3306 \
		--user $(DB_USERNAME) \
		--password $(DB_PASSWORD) \
		--database $(DB_NAME) \
		--info-level=maximum \
		$(if $(filter $(outputFormat),markdown), \
			--command script \
			--script-language python \
			--script /libraries/scripts/markdown.py \
			--output-file=/output/schema.md, \
		$(if $(filter $(outputFormat),plantuml), \
			--command script \
			--script-language python \
			--script /libraries/scripts/plantuml.py \
			--output-file=/output/schema.puml, \
		$(if $(filter $(outputFormat),mermaid), \
			--command script \
			--script-language python \
			--script /libraries/scripts/mermaid.py \
			--output-file=/output/schema.mermaid, \
			--command=schema \
			--output-format=${outputFormat} \
			--output-file=/output/schema.$(outputFormat))))

generate-page-maindb-local:
	$(COMPOSE_RUN) schemaspy -t mysql -db $(DB_NAME) -s $(DB_NAME) -host maindb -u $(DB_USERNAME) -p $(DB_PASSWORD)

generate-doc-maindb:
	$(MAKE) generate-graph-maindb-local outputFormat=markdown
	$(MAKE) generate-graph-maindb-local outputFormat=png
	$(MAKE) generate-page-maindb-local

clean:
	rm -rf output/*

help:
	@echo "Available commands:"
	@echo "  up                   Start the docker-compose services"
	@echo "  start                Start the docker-compose services without recreating containers"
	@echo "  stop                 Stop the docker-compose services without removing containers"
	@echo "  down                 Stop and remove the docker-compose services"
	@echo "  start-db             Start only the database services"
	@echo "  migrate-maindb       Apply database migrations to main database"
	@echo "  diff-maindb          Generate migration diff for main database"
	@echo "  rollback-maindb      Roll back migrations for main database"
	@echo "  generate-graph-maindb Generate schema graph documentation (outputFormat options: markdown, plantuml, mermaid, png)"
	@echo "  generate-page-maindb  Generate page documentation for main database"
	@echo "  generate-doc-maindb   Generate all documentation for main database"
	@echo "  clean                Remove generated files"
	@echo "  help                 Display this help information"