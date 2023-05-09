FROM sharpdressedcodes/node:18.16.0-bullseye-slim

ARG USER_ID
ARG GROUP_ID
ARG TZ=Australia/Sydney
ENV IS_DOCKER=1

USER root

RUN \
    # Add ffmpeg key
#    apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 4AB0F789CBA31744CC7DA76A8CF63AD3F06FC659 && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        # ffmpeg deps
        ffmpeg \
        flvmeta \
        # Cypress deps
        xvfb \
        libgtk-3-dev \
        libnotify-dev \
        libgconf-2-4 \
        libnss3 \
        libxss1 \
        libasound2 \
    ; \
    rm -rf /var/lib/apt/lists/*

USER node
