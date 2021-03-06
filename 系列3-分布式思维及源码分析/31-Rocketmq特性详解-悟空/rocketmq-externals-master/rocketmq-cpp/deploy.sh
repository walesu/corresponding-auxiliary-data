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


VERSION="rocketmq-client4cpp"
CWD_DIR=$(cd "$(dirname "$0")"; pwd)
DEPLOY_BUILD_HOME=${CWD_DIR}/${VERSION}

# ##====================================================================
make
# ##====================================================================
# # deploy
rm -rf   ${DEPLOY_BUILD_HOME}
mkdir -p ${DEPLOY_BUILD_HOME}/lib
mkdir -p ${DEPLOY_BUILD_HOME}/logs
rm -rf ${CWD_DIR}/bin/*.log
cp -rf ${CWD_DIR}/bin/*.a   ${DEPLOY_BUILD_HOME}/lib/
cp -rf ${CWD_DIR}/bin/*.so  ${DEPLOY_BUILD_HOME}/lib/
cp -rf ${CWD_DIR}/include ${DEPLOY_BUILD_HOME}/
cp -rf ${CWD_DIR}/example ${DEPLOY_BUILD_HOME}/
cp -rf ${CWD_DIR}/doc 	  ${DEPLOY_BUILD_HOME}/
cp -rf ${CWD_DIR}/readme  ${DEPLOY_BUILD_HOME}/


cd ${CWD_DIR} && tar -cvzf ./${VERSION}.tar.gz ./${VERSION}  >/dev/null 2>&1
rm -rf ${DEPLOY_BUILD_HOME}
# # ##====================================================================
make clean
