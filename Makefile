app_version = 0.0.0
client_dir = client
docker_dir = docker
server_dir = server

uv = $(shell which uv)
pnpm = $(shell which pnpm)
docker = $(shell which docker)

init:
	$(pnpm) i --frozen-lockfile
	$(uv) sync --all-groups --all-packages --frozen

start: init
	@trap 'kill 0' EXIT; \
	(cd $(client_dir) && $(pnpm) start) & \
	(cd $(server_dir) && DEBUG=True RELOAD=True $(uv) run server) & \
	wait

build: init
	$(pnpm) -r build
	$(uv) build --all-packages

serve: build
	@trap 'kill 0' EXIT; \
	(cd $(client_dir) && $(pnpm) serve) & \
	(cd $(server_dir) && $(uv) run server) & \
	wait

clean:
	rm -rf dist/ node_modules/ .venv/
	cd $(client_dir) && rm -rf dist/ node_modules/
	cd $(server_dir) && find . -name __pycache__ -exec rm -rf {} +

docker_build:
	$(docker) build -t tybot-client:$(app_version) -f $(docker_dir)/$(client_dir)/Dockerfile .
	$(docker) build -t tybot-server:$(app_version) -f $(docker_dir)/$(server_dir)/Dockerfile .

docker_serve: docker_build
	$(docker) compose -f docker/docker-compose.yaml up -d
	cd $(docker_dir) && $(docker) compose logs -f

docker_clean:
	$(docker) compose -f docker/docker-compose.yaml down
	$(docker) system prune -f

check: init
	$(pnpm) prettier -c . && $(pnpm) -r exec eslint
	$(uv) run ruff check --no-cache && $(uv) run mypy .

write: init
	$(pnpm) prettier -w . && $(pnpm) -r exec eslint --fix
	$(uv) run ruff format --no-cache
