#!/bin/bash

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

ragel -I src -G2 src/ngx_http_memc_response.rl
util/fix-clang-warnings

if [ $? != 0 ]; then
    echo 'Failed to generate the memcached response parser.' 1>&2
    exit 1;
fi

root=`pwd`
version=$1
home=~
force=$2

ngx-build $force $version \
    --with-ld-opt="-L$PCRE_LIB -Wl,-rpath,$PCRE_LIB:$LIBDRIZZLE_LIB:/usr/local/lib" \
    --with-cc-opt="-O2" \
    --with-http_addition_module \
    --without-mail_pop3_module \
    --without-mail_imap_module \
    --without-mail_smtp_module \
    --without-http_upstream_ip_hash_module \
    --without-http_empty_gif_module \
    --without-http_referer_module \
    --without-http_autoindex_module \
    --without-http_auth_basic_module \
    --without-http_userid_module \
    --add-module=$root $opts \
    --add-module=$root/../ndk-nginx-module \
    --add-module=$root/../eval-nginx-module \
    --add-module=$root/../echo-nginx-module \
    --add-module=$root/../set-misc-nginx-module \
    --add-module=$root/../lua-nginx-module \
          --with-select_module \
          --with-poll_module \
    --with-debug
    #--add-module=$home/work/nginx/nginx_upstream_hash-0.3 \
  #--without-http_ssi_module  # we cannot disable ssi because echo_location_async depends on it (i dunno why?!)

