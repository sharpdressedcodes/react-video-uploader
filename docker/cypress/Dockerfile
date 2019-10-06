FROM node:10.16.3-stretch-slim

ENV CYPRESS_VERSION 3.4.1
ENV CYPRESS_CRASH_REPORTS 0

RUN \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        # Cypress
        xvfb \
        libgtk-3-dev \
        libnotify-dev \
        libgconf-2-4 \
        libnss3 \
        libxss1 \
        libasound2 \
        # Other
        sudo \
    && \
    rm -rf /var/lib/apt/lists/*

RUN \
    # Enable node user logging into sudo without password
    #echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers; \
    echo 'node ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers;

USER node

RUN sudo npm config -g set user node
RUN sudo npm install -g "cypress@${CYPRESS_VERSION}" --unsafe-perm --silent

# The npm install doesn't install the binary properly, Re-install it here.
RUN cypress install
RUN cypress verify
RUN cypress cache path
RUN cypress cache list

RUN echo "alias ll='ls -laF'" >> $HOME/.bashrc

#ENTRYPOINT ["cypress", "run"]
