#FROM node:10.16.3-alpine
#
#RUN \
#    apk update && \
#    apk add --no-cache \
#        bash \
#        ffmpeg \
#        git \
#        openssh \
#        sudo \
#    ;
#
#RUN \
#    # Enable dev logging into sudo without password
#    sed -e 's/# %wheel ALL=(ALL) NOPASSWD: ALL/%wheel ALL=(ALL) NOPASSWD: ALL/g' -i /etc/sudoers; \
#    sed -e 's/^wheel:\(.*\)/wheel:\1,node/g' -i /etc/group
FROM node:10.16.3-stretch-slim

RUN { \
    echo "deb [trusted=yes] http://ppa.launchpad.net/jonathonf/ffmpeg-4/ubuntu eoan main"; \
    echo "deb-src [trusted=yes] http://ppa.launchpad.net/jonathonf/ffmpeg-4/ubuntu eoan main"; \
} >> /etc/apt/source.list

RUN \
    # Add ffmpeg key
    apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 4AB0F789CBA31744CC7DA76A8CF63AD3F06FC659 && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        bash \
        ffmpeg \
        flvmeta \
        git \
        ssh \
        sudo \
    ; \
    rm -rf /var/lib/apt/lists/*

RUN \
    # Enable node user logging into sudo without password
    echo 'node ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers;

USER node

RUN echo "alias ll='ls -laF'" >> $HOME/.bashrc
