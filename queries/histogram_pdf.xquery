let $nbClasse := xs:integer(1 + floor(math:log(count(//etablissement[not(_#_CRITERE_#_ = 'NaN')_#_WHERE_CLAUSE_#_]))))
let $min := min(//etablissement[not(_#_CRITERE_#_ = 'NaN')_#_WHERE_CLAUSE_#_]/_#_CRITERE_#_)
let $max := max(//etablissement[not(_#_CRITERE_#_ = 'NaN')_#_WHERE_CLAUSE_#_]/_#_CRITERE_#_)
let $amplitude := ($max - $min) div $nbClasse let $in := <values> { for $x at $pos in (1 to $nbClasse)
return <value beginValue='{$ min + (($pos - 1) * $amplitude)}' endValue='{$min + (($pos) * $amplitude)}'>
{for $y in /ONISEP_ETABLISSEMENT
	 return count(//etablissement[not(_#_CRITERE_#_ = 'NaN') and _#_CRITERE_#_> $min + (($pos - 1) * $amplitude) and _#_CRITERE_#_ < $min + (($pos) * $amplitude)_#_WHERE_CLAUSE_#_])}</value>
}</values>
 let $style := 
<xsl:stylesheet version='2.0' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns:math='http://exslt.org/math' xmlns:fo='http://www.w3.org/1999/XSL/Format' xmlns:svg='http://www.w3.org/2000/svg'>
	<xsl:template match='values'>
		<fo:root>
			<fo:layout-master-set>
				<fo:simple-page-master master-name='first' page-height='29.7cm' page-width='21cm' margin-top='1cm' margin-bottom='2cm' margin-left='2.5cm' margin-right='2.5cm'>
			 		<fo:region-body margin-top="1cm"/>
      				<fo:region-before extent="1cm"/>
     				<fo:region-after/>
			 	</fo:simple-page-master>
			 </fo:layout-master-set>
			 <fo:page-sequence master-reference='first'>
			 	<fo:static-content flow-name="xsl-region-before">
						<fo:block text-align-last="justify">
 							<fo:external-graphic src="../public/images/uns.png"/>
 							<fo:leader leader-pattern="space" />
 							<fo:external-graphic src="../public/images/miage.jpg"/>
 						</fo:block>
					</fo:static-content>
					<fo:static-content flow-name="xsl-region-after">
  						<fo:block text-align-last="justify">
 							Page <fo:page-number/>
 							<fo:leader leader-pattern="space" />
 							Document généré le {format-dateTime(current-dateTime(), '[D01]/[M01]/[Y0001] à [H01]:[m01]:[s01]')}
 						</fo:block>
					</fo:static-content>
				<fo:flow flow-name='xsl-region-body' font-size='14pt' line-height='14pt'>
					<fo:block font-size="36pt" text-align="center" line-height="100pt" space-before="0.5cm" space-after="1.0cm">
						Répartition _#_TITLE_#_
					</fo:block>
					<fo:block>
						<fo:instream-foreign-object>
							<svg:svg width='700' height='400' version='1.1' style='font-family: Verdana; stroke: none; font-size: 10px;'>
								<xsl:variable name='sumMagnitude' select='sum(//value)'/>
								<svg:line x1='45' y1='347' x2='45' y2='35' style='stroke:black;stroke-width:2'/>
								<svg:line x1='40' y1='342' x2='365' y2='342' style='stroke:black;stroke-width:2'/>
								<svg:line x1='40' y1='310' x2='50' y2='310' style='stroke:blacK;stroke-width:1'/>
								<svg:text x='20' y='310'>0.1</svg:text>
								<svg:line x1='40' y1='280' x2='50' y2='280' style='stroke:black;stroke-width:1'/>
								<svg:text x='20' y='280'>0.2</svg:text>
								<svg:line x1='40' y1='250' x2='50' y2='250' style='stroke:black;stroke-width:1'/>
								<svg:text x='20' y='250'>0.3</svg:text>
								<svg:line x1='40' y1='220' x2='50' y2='220' style='stroke:black;stroke-width:1'/>
								<svg:text x='20' y='220'>0.4</svg:text>
								<svg:line x1='40' y1='190' x2='50' y2='190' style='stroke:black;stroke-width:1'/>
								<svg:text x='20' y='190'>0.5</svg:text>
								<svg:line x1='40' y1='160' x2='50' y2='160' style='stroke:black;stroke-width:1'/>
								<svg:text x='20' y='160'>0.6</svg:text>
								<svg:line x1='40' y1='130' x2='50' y2='130' style='stroke:black;stroke-width:1'/>
								<svg:text x='20' y='130'>0.7</svg:text>
								<svg:line x1='40' y1='100' x2='50' y2='100' style='stroke:black;stroke-width:1'/>
								<svg:text x='20' y='100'>0.8</svg:text>
								<svg:line x1='40' y1='70' x2='50' y2='70' style='stroke:black;stroke-width:1'/>
								<svg:text x='20' y='70'>0.9</svg:text>
								<svg:line x1='40' y1='40' x2='50' y2='40' style='stroke:black;stroke-width:1'/>
								<svg:text x='20' y='40'>1.0</svg:text>
								<svg:polygon points='40,35 50,35 45,25' style='fill:black;stroke:black;stroke-width:1'/>
								<svg:polygon points='365,337 365,347 375,342' style='fill:black;stroke:black;stroke-width:1'/>
								<xsl:for-each select='//value'>
									<xsl:variable name='effectif' select='.'/>
									<svg:rect x='{{50 + ((position() - 1) * (300 div count(//value)))}}' y='{{340 - (($effectif div $sumMagnitude) * 300)}}' width='{{300 div count(//value)}}' height='{{($effectif div $sumMagnitude) * 300}}' style='fill:rgb(128,214,242);stroke:black;stroke-width:1;'/>"
									<svg:text x='{{50 + ((position() - 1) * (300 div count(//value)))}}' y='342' transform='translate(0,5) rotate(70 , {{50 + ((position() - 1) * (300 div count(//value)))}} ,342)'><xsl:value-of select='./@beginValue'/></svg:text>
									<xsl:choose>
										<xsl:when test='position() = last()'>
											<svg:text x='{{50 + (position() * (300 div count(//value)))}}' y='342' transform='translate(0,5) rotate(70 , {{50 + (position() * (300 div count(//value)))}} ,342)'><xsl:value-of select='./@endValue'/></svg:text>
										</xsl:when>
									</xsl:choose>
								</xsl:for-each>
							
							</svg:svg>
						</fo:instream-foreign-object>
					</fo:block>
				</fo:flow>
			</fo:page-sequence> 
		</fo:root>
	</xsl:template>
</xsl:stylesheet>
let $result := xslt:transform($in, $style)
return file:write('_#_FILEPATH_#_.fo', $result)