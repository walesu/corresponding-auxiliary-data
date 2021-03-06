#!/usr/bin/env bash

#
# Copyright 2021-2022 the original author or authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# this file is mostly meant to be used by the author himself.

root=`pwd`
version=$1
force=$2
home=~

            #--with-cc=gcc46 \

ngx-build $force $version \
            --with-ld-opt="-L$PCRE_LIB -Wl,-rpath,$PCRE_LIB:$LIBDRIZZLE_LIB:/usr/local/lib" \
            --with-cc-opt="-DDEBUG_MALLOC" \
            --with-http_stub_status_module \
            --with-http_image_filter_module \
            --without-mail_pop3_module \
            --without-mail_imap_module \
            --without-mail_smtp_module \
            --without-http_upstream_ip_hash_module \
            --without-http_memcached_module \
            --without-http_referer_module \
            --without-http_autoindex_module \
            --without-http_auth_basic_module \
            --without-http_userid_module \
          --add-module=$root/../ndk-nginx-module \
          --add-module=$root/../set-misc-nginx-module \
          --add-module=$root/../eval-nginx-module \
          --add-module=$root/../xss-nginx-module \
          --add-module=$root/../rds-json-nginx-module \
          --add-module=$root/../headers-more-nginx-module \
          --add-module=$root/../lua-nginx-module \
          --add-module=$root $opts \
          --with-http_v2_module \
          --with-select_module \
          --with-poll_module \
          --without-http_ssi_module \
          --with-debug || exit 1
          #--add-module=$root/../lz-session-nginx-module \
          #--add-module=$home/work/ndk \
          #--add-module=$home/work/ndk/examples/http/set_var \
          #--add-module=$root/../eval-nginx-module \
          #--add-module=/home/agentz/work/nginx_eval_module-1.0.1 \

