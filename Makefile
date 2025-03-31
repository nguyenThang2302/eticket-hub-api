COMPOSE_RUN=docker-compose run --rm

MYSQL_USERNAME=eth_username
MYSQL_PASSWORD=eth_password
MYSQL_ROOT_PASSWORD=root
MYSQL_HOST=maindb
MYSQL_DEV_HOST=maindb-dev
MYSQL_SCHEMA=eth_main

MYSQL_URL=mysql://$(MYSQL_USERNAME):$(MYSQL_PASSWORD)@$(MYSQL_HOST):3306/$(MYSQL_SCHEMA)
MYSQL_DEV_URL=mysql://$(MYSQL_USERNAME):$(MYSQL_PASSWORD)@$(MYSQL_DEV_HOST):3306/$(MYSQL_SCHEMA)

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

migrate-maindb:
	$(COMPOSE_RUN) atlas migrate apply --dir file:///migrations --url $(MYSQL_URL)

diff-maindb:
	$(COMPOSE_RUN) atlas migrate diff --to file:///schema.hcl --dir file:///migrations --dev-url $(MYSQL_DEV_URL)
	$(COMPOSE_RUN) atlas migrate hash --dir file:///migrations

rollback-maindb:
	$(COMPOSE_RUN) atlas migrate down --dir file:///migrations --url $(MYSQL_URL) --dev-url $(MYSQL_DEV_URL)

re-hash-maindb:
	$(COMPOSE_RUN) atlas migrate hash --dir file:///migrations

generate-graph-maindb:
	$(COMPOSE_RUN) schemacrawler /opt/schemacrawler/bin/schemacrawler.sh \
		--server mysql \
		--host $(MYSQL_HOST) \
		--port 3306 \
		--user $(MYSQL_USERNAME) \
		--password $(MYSQL_PASSWORD) \
		--database $(MYSQL_SCHEMA) \
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

generate-page-maindb:
	$(COMPOSE_RUN) schemaspy -t mysql -db $(MYSQL_SCHEMA) -s $(MYSQL_SCHEMA) -host $(MYSQL_HOST) -u $(MYSQL_USERNAME) -p $(MYSQL_PASSWORD)

generate-doc-maindb: generate-graph-maindb generate-page-maindb

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