from collections.abc import Sequence

import sqlalchemy as sa
import sqlmodel.sql.sqltypes
from alembic import op
${imports if imports else ""}

revision: str = ${repr(up_revision)}
depends_on: str | Sequence[str] | None = ${repr(depends_on)}
branch_labels: str | Sequence[str] | None = ${repr(branch_labels)}
down_revision: str | Sequence[str] | None = ${repr(down_revision)}


def upgrade() -> None:
    ${upgrades if upgrades else "pass"}


def downgrade() -> None:
    ${downgrades if downgrades else "pass"}
