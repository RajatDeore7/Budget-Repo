FROM 570284437616.dkr.ecr.ca-central-1.amazonaws.com/shine:react_base

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION=v16.15.1
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/v$NODE_VERSION/bin:$PATH

ADD React/Docker/run.sh /
RUN chmod 755 /*.sh

ADD ./React /var/www
RUN source $NVM_DIR/nvm.sh && cd /var/www/ && yarn install --location=global && npm run build
RUN rm -rf /var/www/node_modules
RUN rm -rf /var/www/src

EXPOSE 80

CMD ["/run.sh"]
