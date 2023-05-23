#!/bin/bash

userdel -f node  && \
if getent group node ; then groupdel node; fi && \
groupadd -g ${GROUP_ID} node && \
useradd -l -u ${USER_ID} -g node -G sudo -s /bin/bash node && \
install -d -m 0755 -o node -g node /home/node && \
chown --changes --silent --no-dereference --recursive \
--from=1000:1000 ${USER_ID}:${GROUP_ID} \
/home/node \
; \
