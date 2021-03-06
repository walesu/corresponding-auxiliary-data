/*
 * Copyright 2021-2022 the original author or authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import _ from 'lodash';
import Ipv4Address from 'ui/utils/ipv4_address';
import uiModules from 'ui/modules';

uiModules
  .get('kibana')
  .directive('validateIp', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        'ngModel': '=',
      },
      link: function ($scope, elem, attr, ngModel) {
        function validateIp(ipAddress) {
          if (ipAddress == null || ipAddress === '') {
            ngModel.$setValidity('ipInput', true);
            return null;
          }

          try {
            ipAddress = new Ipv4Address(ipAddress);
            ngModel.$setValidity('ipInput', true);
            return ipAddress.toString();
          } catch (e) {
            ngModel.$setValidity('ipInput', false);
          }
        }

        // From User
        ngModel.$parsers.unshift(validateIp);

        // To user
        ngModel.$formatters.unshift(validateIp);
      }
    };
  });
