##FROM node:10.16.3-alpine
##
##RUN \
##    apk update && \
##    apk add --no-cache \
##        bash \
##        ffmpeg \
##        git \
##        openssh \
##        sudo \
##    ;
##
##RUN \
##    # Enable dev logging into sudo without password
##    sed -e 's/# %wheel ALL=(ALL) NOPASSWD: ALL/%wheel ALL=(ALL) NOPASSWD: ALL/g' -i /etc/sudoers; \
##    sed -e 's/^wheel:\(.*\)/wheel:\1,node/g' -i /etc/group
#FROM node:10.16.3-stretch-slim
#
#RUN { \
#    echo "deb [trusted=yes] http://ppa.launchpad.net/jonathonf/ffmpeg-4/ubuntu eoan main"; \
#    echo "deb-src [trusted=yes] http://ppa.launchpad.net/jonathonf/ffmpeg-4/ubuntu eoan main"; \
#} >> /etc/apt/source.list
#
#RUN \
#    # Add ffmpeg key
#    apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 4AB0F789CBA31744CC7DA76A8CF63AD3F06FC659 && \
#    apt-get update && \
#    apt-get install -y --no-install-recommends \
#        bash \
#        ffmpeg \
#        flvmeta \
#        git \
#        ssh \
#        sudo \
#    ; \
#    rm -rf /var/lib/apt/lists/*
#
#RUN \
#    # Enable node user logging into sudo without password
#    echo 'node ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers;
#
#USER node
#
#RUN echo "alias ll='ls -laF'" >> $HOME/.bashrc
#
#
#
## Node JS version notes
##
## Take care when selecting the Node version.
## It's best to try and mimic production as closely as possible for development.
## For example: if production is running Node 14.17.3, don't run Node 16.x.x for development.
## While you might gain the latest and greatest features of Node, but these won't be available in production.
##
## Production applications should only use Active LTS or Maintenance LTS releases
## See this page for the latest version: https://nodejs.org/en/about/releases/
## Current LTS version on 24 Mar 2022 is v16
#
## Find the latest Node docker image here: https://hub.docker.com/_/node
## Click on "tags" and scroll down until you see the latest LTS version with all 3 version numbers (major.minor.patch) in the tag.
## Be specific about which version you want. Don't use any "latest" tags,
## as this will grab the latest image and potentially break your code.
## For example: don't use "lts-buster", "latest". Choose something like "14.17.3-buster-slim"
## The "buster-slim" part at the end is the operating system.
## In this case it's Debian Buster. The slim part means the image has been trimmed down
## (apps that would normally come with a normal version of Buster are not in this image, in an effort to make it smaller in size).
## Current LTS docker version on 24 Mar 2022 is 16.14.2
#FROM node:16.14.2-buster-slim
#
## Set the timezone to local time. This can be overridden by passing in a "TZ=xxx/xxx" string.
#ENV TZ=Australia/Sydney
## Set a variable which can be used by Node apps (process.env.IS_DOCKER),
## to see if the app is being run inside a Docker container
#ENV IS_DOCKER=1
#
#RUN \
#    apt-get update && \
#    apt-get install -y --no-install-recommends \
#        bash \
#        git \
#        ssh \
#        sudo \
#        ca-certificates \
#        curl \
#        nano \
#        iproute2 \
#    ; \
#    rm -rf /var/lib/apt/lists/*
#
#RUN \
#    # Enable node user logging into sudo without password
#    echo 'node ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers;
#
#RUN \
#    # Set correct time zone
#    echo "$TZ" > /etc/timezone; \
#    rm -f /etc/localtime; \
#    dpkg-reconfigure -f noninteractive tzdata;
#
## Switch from "root" user to "node" user. Otherwise npm packages will be installed as "root"
#USER node
#
## This just makes it easier to look at files in the container, without having to type out the whole command.
#RUN echo "alias ll='ls -laF'" >> $HOME/.bashrc
#
#RUN \
#    # Force using bash instead of sh
#    sudo sed -i 's|/bin/sh|/bin/bash|' /usr/local/bin/docker-entrypoint.sh; \
#    sudo sed -i 's|if |#if |' /usr/local/bin/docker-entrypoint.sh; \
#    sudo sed -i 's|fi|#fi|' /usr/local/bin/docker-entrypoint.sh; \
#    sudo sed -i 's|set -- node "$@"|#set -- node "$@"|' /usr/local/bin/docker-entrypoint.sh; \
#    # Remove exec "$@" and just use "$@" otherwise nvm, node, npm, npx won't work
#    sudo sed -i 's|exec|source /home/node/.bashrc\n"$@"\n#exec|' /usr/local/bin/docker-entrypoint.sh;
#
## Override default command (node). This will add a route so this container can access the underlying host.
#CMD ["sh", "-c", "echo \"`/sbin/ip route | awk '/default/ { print $3 }'`\tdocker.host.internal\" | sudo tee -a /etc/hosts > /dev/null && node"]


FROM sharpdressedcodes/node:16.15.0-bullseye-slim

USER root

#RUN { \
#    echo "deb [trusted=yes] http://ppa.launchpad.net/jonathonf/ffmpeg-4/ubuntu eoan main"; \
#    echo "deb-src [trusted=yes] http://ppa.launchpad.net/jonathonf/ffmpeg-4/ubuntu eoan main"; \
#} >> /etc/apt/source.list

RUN \
    # Add ffmpeg key
#    apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 4AB0F789CBA31744CC7DA76A8CF63AD3F06FC659 && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        ffmpeg \
        flvmeta \
    ; \
    rm -rf /var/lib/apt/lists/*

USER node

# Ignore npm update notices
RUN echo "update-notifier=false" > $HOME/.npmrc
