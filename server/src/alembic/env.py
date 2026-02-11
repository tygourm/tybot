from alembic import context

from server.core.injector import engine
from server.core.settings import settings
from server.infra.db.models import Model

target_metadata = Model.metadata


def run_migrations_offline() -> None:
    context.configure(
        literal_binds=True,
        url=settings.database_url,
        target_metadata=target_metadata,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
