client_dir = client
server_dir = server

uv = $(shell which uv)
pnpm = $(shell which pnpm)

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

check: init
	$(pnpm) prettier -c . && $(pnpm) -r exec eslint
	$(uv) run ruff check --no-cache && $(uv) run mypy .

write: init
	$(pnpm) prettier -w . && $(pnpm) -r exec eslint --fix
	$(uv) run ruff format --no-cache
