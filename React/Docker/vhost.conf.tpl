server {
    listen 80;
    server_name default_server;

    #if ($http_x_forwarded_proto = "http") {
    #    rewrite ^(.*)$ https://$server_name$1 permanent;
    #}

    root /var/www/dist/;
    index index.html;
    #rewrite ^/(.*)/$ $1 permanent;
    location / {
       index index.html;
       try_files $uri /index.html$is_args$args =404;
    }
}
