<%--
  ~ Copyright 2021-2022 the original author or authors
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~     http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
  --%>
<html>
<head>
<title>Test Pages</title>
</head>
<body>

<h2>Test Pages</h2>

These pages are used to test out the environment and web framework.

<table class="autostripe">
<thead>
<tr>
<th colspan="2">Values</th>
</tr>
</thead>
<tbody>
<tr> 
  <td class="label">Broker type</td>
  <td>${requestContext.brokerQuery.broker.class}</td>
</tr>
<tr> 
  <td class="label">Managed broker</td>
  <td>${requestContext.brokerQuery.brokerAdmin.broker.class}</td>
</tr>
<tr> 
  <td class="label">Destinations</td>
  <td>${requestContext.brokerQuery.managedBroker.queueRegion.destinationMap}</td>
</tr>
</tbody>
</table>


</body>
</html>
	
