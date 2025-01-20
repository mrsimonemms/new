FROM golang AS builder
ARG GIT_COMMIT
ARG GIT_REPO="{{ cookiecutter.repo }}"
ARG PROJECT_NAME="{{ cookiecutter.project_name }}"
ARG VERSION
WORKDIR /app
COPY . .
ENV CGO_ENABLED=0
ENV GOOS=linux
ENV PROJECT_NAME="${PROJECT_NAME}"
RUN go build \
  -ldflags \
  "-w -s -X $GIT_REPO/cmd.Version=$VERSION -X $GIT_REPO/cmd.GitCommit=$GIT_COMMIT" \
  -o /app/app
ENTRYPOINT [ "/app/app" ]

FROM scratch
WORKDIR /app
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=builder /app/app /app
ENTRYPOINT [ "/app/app" ]
