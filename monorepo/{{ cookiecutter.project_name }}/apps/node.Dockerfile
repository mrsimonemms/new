FROM node:lts AS dev
ARG APP
ARG GIT_COMMIT
ARG VERSION
USER node
WORKDIR /home/node/root
ENV GIT_COMMIT="${GIT_COMMIT}"
ENV VERSION="${VERSION}"
COPY --chown=node:node . .
WORKDIR /home/node/root/apps/$APP
ENV PORT=3000
ENV LOGGER_COLORS_ENABLED=true
ENV LOGGER_JSON_ENABLED=false
ENV LOGGER_LEVEL=verbose
EXPOSE 3000
CMD [ "npm", "run", "start:dev" ]

FROM node:lts-alpine AS builder
ARG APP
USER node
WORKDIR /home/node/root
COPY --from=dev /home/node/root .
WORKDIR /home/node/root/apps/$APP
RUN npm ci \
  && npm run build

FROM node:lts-alpine
ARG APP
ARG GIT_COMMIT
ARG VERSION
WORKDIR /opt/app
ENV GIT_COMMIT="${GIT_COMMIT}"
ENV VERSION="${VERSION}"
ENV SERVER_PORT=3000
COPY --from=builder /home/node/root/apps/$APP/dist dist
COPY --from=builder /home/node/root/apps/$APP/node_modules node_modules
COPY --from=builder /home/node/root/apps/$APP/package.json package.json
COPY --from=builder /home/node/root/apps/$APP/package-lock.json package-lock.json
RUN npm prune --omit=dev \
  && npm rebuild \
  && npm dedupe \
  && npm version ${VERSION} --no-git-tag-version --allow-same-version || true
USER node
EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]
