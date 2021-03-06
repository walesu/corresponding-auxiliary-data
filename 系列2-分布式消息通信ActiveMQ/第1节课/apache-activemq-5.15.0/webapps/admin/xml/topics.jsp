<%@ page contentType="text/xml;charset=ISO-8859-1"%>
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
<%-- Workaround for https://ops4j1.jira.com/browse/PAXWEB-1070 --%>
<%@include file="../WEB-INF/jspf/headertags.jspf" %>
<topics>
<c:forEach items="${requestContext.brokerQuery.topics}" var="row">
<topic name="<c:out value="${row.name}"/> ">

  <stats size="${row.queueSize}"
         consumerCount="${row.consumerCount}"
         enqueueCount="${row.enqueueCount}"
         dequeueCount="${row.dequeueCount}"/>

</topic>
</c:forEach>
</topics>
