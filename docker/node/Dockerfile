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

#RUN addgroup -S nodedev && \
#    adduser -S dev -G nodedev

RUN \
    # Enable dev logging into sudo without password
    sed -e 's/# %wheel ALL=(ALL) NOPASSWD: ALL/%wheel ALL=(ALL) NOPASSWD: ALL/g' -i /etc/sudoers; \
    #sed -e 's/^wheel:\(.*\)/wheel:\1,dev/g' -i /etc/group
    sed -e 's/^wheel:\(.*\)/wheel:\1,node/g' -i /etc/group

#USER dev
USER node

RUN echo "alias ll='ls -laF'" >> $HOME/.bashrc
