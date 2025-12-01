"""Create runs table."""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0002"
depends_on: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
down_revision: str | Sequence[str] | None = "0001"


def upgrade() -> None:
    op.create_table(
        "runs",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("thread_id", sa.Uuid(), nullable=False),
        sa.ForeignKeyConstraint(["thread_id"], ["threads.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("runs")
