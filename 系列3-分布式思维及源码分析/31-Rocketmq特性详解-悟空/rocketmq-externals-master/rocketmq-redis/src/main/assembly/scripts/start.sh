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

binPath=$(cd "$(dirname "$0")"; pwd);
cd $binPath
cd ..
parentPath=`pwd`
libPath=$parentPath/lib/


function exportClassPath(){
    jarFileList=`find "$libPath" -name *.jar |awk -F'/' '{print $(NF)}' 2>>/dev/null`
    CLASSPATH=".:$binPath";
    for jarItem in $jarFileList
      do
        CLASSPATH="$CLASSPATH:$libPath$jarItem"
    done
    CLASSPATH=$CLASSPATH:./conf
    export CLASSPATH
}
ulimit -n 65535
exportClassPath

java -server -Xms512m -Xmx512m -Xss2m -XX:NewRatio=2  -XX:+UseGCOverheadLimit -XX:-UseParallelGC -XX:ParallelGCThreads=24 org.apache.rocketmq.redis.replicator.RocketMQRedisReplicator
