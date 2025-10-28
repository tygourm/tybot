ARG BASE_IMAGE=python:3.12-slim-bookworm
ARG USER=server
ARG GROUP=server


### Install stage ###
FROM $BASE_IMAGE AS installer
RUN pip install uv
WORKDIR /app

COPY uv.lock .
COPY server/pyproject.toml .

RUN uv export -o requirements.txt --no-emit-workspace && \
    pip wheel -r requirements.txt -w /wheels --no-deps --no-cache-dir


### Build stage ###
FROM $BASE_IMAGE AS builder
RUN pip install build hatchling
WORKDIR /app

COPY server .

RUN python -m build -w -nx -o /wheels


### Run stage ###
FROM $BASE_IMAGE
ARG USER
ARG GROUP
RUN groupadd $GROUP && \
    useradd -m -g $GROUP -u 1000 $USER
WORKDIR /home/$USER/app

COPY server/static static

COPY --from=installer /wheels /wheels
RUN pip install /wheels/* --no-deps --no-cache-dir && \
    rm -rf /wheels

COPY --from=builder /wheels /wheels
RUN pip install /wheels/* --no-deps --no-cache-dir && \
    rm -rf /wheels

RUN chown -R $USER:$GROUP /home/$USER
USER $USER
CMD ["server"]
