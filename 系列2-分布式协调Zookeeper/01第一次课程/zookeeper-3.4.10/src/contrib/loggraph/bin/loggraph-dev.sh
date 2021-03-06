#!/bin/sh

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

make_canonical () {
    cd $1; pwd;
}

SCRIPTDIR=`dirname $0`
BUILDDIR=`make_canonical $SCRIPTDIR/../../../../build/contrib/loggraph`
LIBDIR=`make_canonical $BUILDDIR/lib`
WEBDIR=`make_canonical $SCRIPTDIR/../web`
ZKDIR=`make_canonical $SCRIPTDIR/../../../../build/`

if [ ! -x $BUILDDIR ]; then
    echo "\n\n*** You need to build loggraph before running it ***\n\n";
    exit;
fi

for i in `ls $LIBDIR`; do 
    CLASSPATH=$LIBDIR/$i:$CLASSPATH
done

for i in $ZKDIR/zookeeper-*.jar; do
    CLASSPATH="$i:$CLASSPATH"
done

CLASSPATH=$BUILDDIR/classes:$WEBDIR:$CLASSPATH
echo $CLASSPATH
java -Dlog4j.configuration=org/apache/zookeeper/graph/log4j.properties -Xdebug -Xrunjdwp:transport=dt_socket,address=4444,server=y,suspend=n -cp $CLASSPATH org.apache.zookeeper.graph.LogServer $*
