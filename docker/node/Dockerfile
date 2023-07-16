FROM sharpdressedcodes/node:18.16.0-bullseye-slim

ARG USER_ID
ARG GROUP_ID
ARG TZ=Australia/Sydney

ENV IS_DOCKER=1
ENV PATH=$PATH:/home/node/app/node_modules/.bin

USER root

RUN \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        # ffmpeg deps
        ffmpeg \
        flvmeta \
        # Playwright deps
        libnss3 \
        libnspr4 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libcups2 \
        libatspi2.0-0 \
        libxcomposite1 \
        # Playwright - Firefox
        libxtst6 \
        libgtk-3-0 \
        libdbus-glib-1-2 \
        # Playwright - Mobile Safari
        libsoup2.4-dev  \
        libgstreamer1.0  \
        libgstreamer-gl1.0-0 \
        libgstreamer-plugins-base1.0-0  \
        libgstreamer-plugins-bad1.0-0 \
        libgtk-3-dev  \
        libatomic1  \
        libxslt1-dev  \
        libepoxy-dev  \
        liblcms2-dev  \
        libwoff1 \
        libevent-2.1  \
        libharfbuzz-icu0  \
        libwebpdemux2  \
        libenchant-2-2  \
        libsecret-1-0  \
        libhyphen0  \
        libxt6  \
        libmanette-0.2  \
        libgles2  \
    ; \
    rm -rf /var/lib/apt/lists/*

USER node
