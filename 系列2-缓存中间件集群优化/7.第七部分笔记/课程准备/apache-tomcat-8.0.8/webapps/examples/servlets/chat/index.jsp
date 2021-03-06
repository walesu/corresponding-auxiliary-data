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
<%@page contentType="text/html; charset=UTF-8" %>
<% if (session.getAttribute("nickname") == null) {
    response.sendRedirect("login.jsp");
    return;
}
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
<html>
<head>
   <title>JSP Chat</title>
</head>
<frameset rows="1*,4*">
  <frame name="post" src="post.jsp" scrolling="no" title="Post message">
  <frame name="chat" src="chat" scrolling="yes" title="Chat">
</frameset>
</html>
