FROM node:10.16.3-alpine

RUN \
    apk update && \
    apk add --no-cache \
        bash \
        ffmpeg \
        git \
        openssh \
        sudo \
    ;

RUN \
    # Enable dev logging into sudo without password
    sed -e 's/# %wheel ALL=(ALL) NOPASSWD: ALL/%wheel ALL=(ALL) NOPASSWD: ALL/g' -i /etc/sudoers; \
    sed -e 's/^wheel:\(.*\)/wheel:\1,node/g' -i /etc/group

USER node

RUN echo "alias ll='ls -laF'" >> $HOME/.bashrc
