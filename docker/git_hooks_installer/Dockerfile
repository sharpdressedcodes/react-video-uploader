FROM debian:stretch-slim

ARG USER_ID
ARG USER_NAME
ARG GROUP_ID
ARG GROUP_NAME

# Add a user otherwise the hooks get added as root user
RUN \
    groupadd -g ${GROUP_ID} ${GROUP_NAME} && \
    useradd -l -u ${USER_ID} -g ${GROUP_NAME} -G sudo -s /bin/bash ${USER_NAME} && \
    install -d -m 0755 -o ${USER_NAME} -g ${GROUP_NAME} /home/${USER_NAME} && \
    chown --changes --silent --no-dereference --recursive \
        ${USER_ID}:${GROUP_ID} \
        /home/${USER_NAME} \
        ;

USER ${USER_NAME}

ENTRYPOINT sh -c "cd /tmp/hooks && ls | xargs chmod +x && cd /tmp/.git/hooks && find ../../hooks -type f -exec ln -sf {} /tmp/.git/hooks/ \; && echo 'Git hooks installed'"

# To build:
# cd docker/git_hooks_installer
# docker build -t sharpdressedcodes/git-hooks-installer:1.0.0-stretch-slim .

# To push:
# docker push sharpdressedcodes/git-hooks-installer:1.0.0-stretch-slim
