<%@ page contentType="text/html;charset=UTF-8" language="java" %>
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
    <title>测试Session共享内容</title>
</head>
<body>
    <%
         Object sessionMessage = session.getAttribute("sessionMessage");
        if (sessionMessage!=null && sessionMessage.toString().trim().length()>0) {
            out.println("session有值 session="+sessionMessage);
        }else{
            session.setAttribute("sessionMessage","Hello imooc jiangzh");
            out.println("session没有值");
        }
    %>
</body>
</html>
