<?xml version="1.0" encoding="UTF-8"?>
<!--
  ~ Copyright 2021-2021 the original author or authors.
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
  -->

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output method="xml" omit-xml-declaration="yes"/>

	<xsl:param name="sex">Female</xsl:param>

	<xsl:template match="*">
		<xsl:element name="hero">
			<xsl:attribute name="name">
				<xsl:value-of select="@name"/>
			</xsl:attribute>
			<xsl:attribute name="age">
				<xsl:value-of select="@age"/>
			</xsl:attribute>
			<xsl:attribute name="catchphrase">
				<xsl:value-of select="@catchphrase"/>
			</xsl:attribute>
			<xsl:attribute name="sex">
				<xsl:value-of select="$sex"/>
			</xsl:attribute>
		</xsl:element>
	</xsl:template>

</xsl:stylesheet>
