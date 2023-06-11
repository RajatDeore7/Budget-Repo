#!/bin/bash
/etc/init.d/nginx stop
source /usr/local/nvm/nvm.sh
cp /var/www/Docker/vhost.conf.tpl /etc/nginx/conf.d/default.conf

cd /var/www/
# Tweak nginx to match the workers to cpu's
procs=$(cat /proc/cpuinfo |grep processor | wc -l)
sed -i -e "s/worker_processes 2/worker_processes $procs/" /etc/nginx/nginx.conf

cp /var/www/Docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
/etc/init.d/nginx start
exec supervisord -n
