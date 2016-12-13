let $in := <values> { for $x in //etablissement 
_#_WHERE_CLAUSE_#_
group by $values := $x/_#_CRITERE_#_/string() 
_#_SORTINGPARAMETER_#_
return <value count='{count($x/_#_CRITERE_#_)}'>{$values}</value> } </values>
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
						Répartition par _#_TITLE_#_
					</fo:block>
					<fo:block>
						<fo:instream-foreign-object>
							<svg:svg width='500' height='500' version='1.1' style='font-family: Verdana; stroke: none; font-size: 10px;'>
								<svg:circle cx='230' cy='50' r='100' stroke-width='2' stroke='black' fill='none'/>
								<xsl:variable name='sumMagnitude' select='sum(//value/@count)'/>
								<xsl:for-each select='//value'>
									<xsl:variable name='red' select='floor(math:random()*255)'/>
									<xsl:variable name='green' select='floor(math:random()*255)'/>
									<xsl:variable name='blue' select='floor(math:random()*255)'/>
									<xsl:variable name='newAngle' select='(@count + sum(preceding-sibling::value/@count)) div $sumMagnitude*360'/>
									<xsl:variable name='oldAngle' select='(sum(preceding-sibling::value/@count)) div $sumMagnitude*360'/>
									<xsl:choose>
										<xsl:when test='$newAngle &lt; 90'>
											<xsl:variable name='newX' select='230 + 100*math:sin($newAngle*3.14159265359 div 180)'/>
											<xsl:variable name='newY' select='50 - 100*math:cos($newAngle*3.14159265359 div 180)'/>
											<xsl:variable name='oldX' select='230 + 100*math:sin($oldAngle*3.14159265359 div 180)'/>
											<xsl:variable name='oldY' select='50 - 100*math:cos($oldAngle*3.14159265359 div 180)'/>
											<svg:path d='m230,50 l{{$oldX - 230}},{{$oldY - 50}} a100,100 0 0,1 {{$newX - $oldX}},{{$newY - $oldY}} z' fill='rgb({{$red}},{{$green}},{{$blue}})'/>
										</xsl:when>
										<xsl:when test='$newAngle &lt; 180'>
											<xsl:variable name='newX' select='230 + 100*math:cos(($newAngle - 90)*3.14159265359 div 180)'/>
											<xsl:variable name='newY' select='50 + 100*math:sin(($newAngle - 90)*3.14159265359 div 180)'/>
											<xsl:choose>
												<xsl:when test='$oldAngle &lt; 90'>
													<xsl:variable name='oldX' select='230 + 100*math:sin($oldAngle*3.14159265359 div 180)'/>
													<xsl:variable name='oldY' select='50 - 100*math:cos($oldAngle*3.14159265359 div 180)'/>
													<svg:path d='m230,50 l{{$oldX - 230}},{{$oldY - 50}} a100,100 0 0,1 {{$newX - $oldX}},{{$newY - $oldY}} z' fill='rgb({{$red}},{{$green}},{{$blue}})'/>
												</xsl:when>
												<xsl:otherwise>
													<xsl:variable name='oldX' select='230 + 100*math:cos(($oldAngle - 90)*3.14159265359 div 180)'/>
													<xsl:variable name='oldY' select='50 + 100*math:sin(($oldAngle - 90)*3.14159265359 div 180)'/>
													<svg:path d='m230,50 l{{$oldX - 230}},{{$oldY - 50}} a100,100 0 0,1 {{$newX - $oldX}},{{$newY - $oldY}} z' fill='rgb({{$red}},{{$green}},{{$blue}})'/>
												</xsl:otherwise>
											</xsl:choose>
										</xsl:when>
										<xsl:when test='$newAngle &lt; 270'>
											<xsl:variable name='newX' select='230 - 100*math:sin(($newAngle - 180)*3.14159265359 div 180)'/>
											<xsl:variable name='newY' select='50 + 100*math:cos(($newAngle - 180)*3.14159265359 div 180)'/>
											<xsl:choose>
												<xsl:when test='$oldAngle &lt; 90'>
													<xsl:variable name='oldX' select='230 + 100*math:sin($oldAngle*3.14159265359 div 180)'/>
													<xsl:variable name='oldY' select='50 - 100*math:cos($oldAngle*3.14159265359 div 180)'/>
													<svg:path d='m230,50 l{{$oldX - 230}},{{$oldY - 50}} a100,100 0 1,1 {{$newX - $oldX}},{{$newY - $oldY}} z' fill='rgb({{$red}},{{$green}},{{$blue}})'/>
												</xsl:when>
												<xsl:when test='$oldAngle &lt; 180'>
													<xsl:variable name='oldX' select='230 + 100*math:cos(($oldAngle - 90)*3.14159265359 div 180)'/>
													<xsl:variable name='oldY' select='50 + 100*math:sin(($oldAngle - 90)*3.14159265359 div 180)'/>
													<svg:path d='m230,50 l{{$oldX - 230}},{{$oldY - 50}} a100,100 0 0,1 {{$newX - $oldX}},{{$newY - $oldY}} z' fill='rgb({{$red}},{{$green}},{{$blue}})'/>
												</xsl:when>
												<xsl:otherwise>
													<xsl:variable name='oldX' select='230 - 100*math:sin(($oldAngle - 180)*3.14159265359 div 180)'/>
													<xsl:variable name='oldY' select='50 + 100*math:cos(($oldAngle - 180)*3.14159265359 div 180)'/>
													<svg:path d='m230,50 l{{$oldX - 230}},{{$oldY - 50}} a100,100 0 0,1 {{$newX - $oldX}},{{$newY - $oldY}} z' fill='rgb({{$red}},{{$green}},{{$blue}})'/>
												</xsl:otherwise>
											</xsl:choose>
										</xsl:when>
										<xsl:otherwise>
											<xsl:variable name='newX' select='230 - 100*math:cos(($newAngle - 270)*3.14159265359 div 180)'/>
											<xsl:variable name='newY' select='50 - 100*math:sin(($newAngle - 270)*3.14159265359 div 180)'/>
											<xsl:choose>
												<xsl:when test='$oldAngle &lt; 90'>
													<xsl:variable name='oldX' select='230 + 100*math:sin($oldAngle*3.14159265359 div 180)'/>
													<xsl:variable name='oldY' select='50 - 100*math:cos($oldAngle*3.14159265359 div 180)'/>
													<xsl:choose>
														<xsl:when test='$oldY = $newY'>
															<svg:circle class='piechart-part' cx='230' cy='50' r="100" fill='rgb({{$red}},{{$green}},{{$blue}})' />
														</xsl:when>
														<xsl:otherwise>
															<svg:path class='piechart-part' d='m230,50 l{{$oldX - 230}},{{$oldY - 50}} a100,100 0 1,1 {{$newX - $oldX}},{{$newY - $oldY}} z' fill='rgb({{$red}},{{$green}},{{$blue}})'/>
														</xsl:otherwise>
													</xsl:choose>
												</xsl:when>
												<xsl:when test='$oldAngle &lt; 180'>
													<xsl:variable name='oldX' select='230 + 100*math:cos(($oldAngle - 90)*3.14159265359 div 180)'/>
													<xsl:variable name='oldY' select='50 + 100*math:sin(($oldAngle - 90)*3.14159265359 div 180)'/>
													<svg:path d='m230,50 l{{$oldX - 230}},{{$oldY - 50}} a100,100 0 1,1 {{$newX - $oldX}},{{$newY - $oldY}} z' fill='rgb({{$red}},{{$green}},{{$blue}})'/>
												</xsl:when>
												<xsl:when test='$oldAngle &lt; 270'>
													<xsl:variable name='oldX' select='230 - 100*math:sin(($oldAngle - 180)*3.14159265359 div 180)'/>
													<xsl:variable name='oldY' select='50 + 100*math:cos(($oldAngle - 180)*3.14159265359 div 180)'/>
													<svg:path d='m230,50 l{{$oldX - 230}},{{$oldY - 50}} a100,100 0 0,1 {{$newX - $oldX}},{{$newY - $oldY}} z' fill='rgb({{$red}},{{$green}},{{$blue}})'/>
												</xsl:when>
												<xsl:otherwise>
													<xsl:variable name='oldX' select='230 - 100*math:cos(($oldAngle - 270)*3.14159265359 div 180)'/>
													<xsl:variable name='oldY' select='50 - 100*math:sin(($oldAngle - 270)*3.14159265359 div 180)'/>
													<svg:path d='m230,50 l{{$oldX - 230}},{{$oldY - 50}} a100,100 0 0,1 {{$newX - $oldX}},{{$newY - $oldY}} z' fill='rgb({{$red}},{{$green}},{{$blue}})'/>
												</xsl:otherwise>
											</xsl:choose>
										</xsl:otherwise>
									</xsl:choose>
									<xsl:variable name='legend' select='.'/>
									<xsl:variable name='counter' select='position()'/>
									<svg:rect class='rect-legend' x='{{10 + (floor(((10 * $counter) + $counter) div 385) * 300)}}' y='{{170 + (((10 * $counter) + $counter) mod 385)}}' width='10' height='10' fill='rgb({{$red}},{{$green}},{{$blue}})' stroke-width='1'/>
									<svg:text x='{{21 + (floor(((10 * $counter) + $counter) div 385) * 300)}}' y='{{170 + (((10 * $counter) + $counter + 7) mod 385)}}'>
										<xsl:choose>
											<xsl:when test='not(text())'>
												Non renseigné
											</xsl:when>
											<xsl:otherwise>
												<xsl:value-of select='.'/>
											</xsl:otherwise>
										</xsl:choose>
										(<xsl:value-of select='@count'/>)
										(<xsl:value-of select='format-number( (@count div $sumMagnitude) * 100, "#.00")'/>%)
									</svg:text>
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