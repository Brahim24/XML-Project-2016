let $in := <values> { for $x in //etablissement 
_#_WHERE_CLAUSE_#_
group by $values := $x/_#_CRITERE_#_/string() 
_#_SORTINGPARAMETER_#_
return <value count='{count($x/_#_CRITERE_#_)}'>{$values}</value> } </values>
let $style := <xsl:stylesheet version='2.0' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns:math='http://exslt.org/math'>
		<xsl:template match='values'>
			<div>
				<svg width='1500' height='400' version='1.1' style='font-family: Verdana; stroke: none; font-size: 10px;'>
					<circle cx='125' cy='200' r='100' stroke-width='2' stroke='black' fill='none'/>
					<xsl:variable name='sumMagnitude' select='sum(//value/@count)'/>
					<xsl:for-each select='//value'>
						<xsl:variable name='red' select='floor(math:random()*255)'/>
						<xsl:variable name='green' select='floor(math:random()*255)'/>
						<xsl:variable name='blue' select='floor(math:random()*255)'/>
						<xsl:variable name='newAngle' select='(@count + sum(preceding-sibling::value/@count)) div $sumMagnitude*360'/>
						<xsl:variable name='oldAngle' select='(sum(preceding-sibling::value/@count)) div $sumMagnitude*360'/>
						<xsl:choose>
							<xsl:when test='$newAngle &lt; 90'>
								<xsl:variable name='newX' select='125 + 100*math:sin($newAngle*3.14159265359 div 180)'/>
								<xsl:variable name='newY' select='200 - 100*math:cos($newAngle*3.14159265359 div 180)'/>
								<xsl:variable name='oldX' select='125 + 100*math:sin($oldAngle*3.14159265359 div 180)'/>
								<xsl:variable name='oldY' select='200 - 100*math:cos($oldAngle*3.14159265359 div 180)'/>
								<path class='piechart-part' d='m125,200 l{{$oldX - 125}},{{$oldY - 200}} a100,100 0 0,1 {{$newX - $oldX}},{{$newY - $oldY}} z' fill='rgb({{$red}},{{$green}},{{$blue}})' style='display:none;'/>
							</xsl:when>
							<xsl:when test='$newAngle &lt; 180'>
								<xsl:variable name='newX' select='125 + 100*math:cos(($newAngle - 90)*3.14159265359 div 180)'/>
								<xsl:variable name='newY' select='200 + 100*math:sin(($newAngle - 90)*3.14159265359 div 180)'/>
								<xsl:choose>
									<xsl:when test='$oldAngle &lt; 90'>
										<xsl:variable name='oldX' select='125 + 100*math:sin($oldAngle*3.14159265359 div 180)'/>
										<xsl:variable name='oldY' select='200 - 100*math:cos($oldAngle*3.14159265359 div 180)'/>
										<path class='piechart-part' d='m125,200 l{{$oldX - 125}},{{$oldY - 200}} a100,100 0 0,1 {{$newX - $oldX}},{{$newY - $oldY}} z' fill='rgb({{$red}},{{$green}},{{$blue}})' style='display:none;'/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:variable name='oldX' select='125 + 100*math:cos(($oldAngle - 90)*3.14159265359 div 180)'/>
										<xsl:variable name='oldY' select='200 + 100*math:sin(($oldAngle - 90)*3.14159265359 div 180)'/>
										<path class='piechart-part' d='m125,200 l{{$oldX - 125}},{{$oldY - 200}} a100,100 0 0,1 {{$newX - $oldX}},{{$newY - $oldY}} z' fill='rgb({{$red}},{{$green}},{{$blue}})' style='display:none;'/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test='$newAngle &lt; 270'>
								<xsl:variable name='newX' select='125 - 100*math:sin(($newAngle - 180)*3.14159265359 div 180)'/>
								<xsl:variable name='newY' select='200 + 100*math:cos(($newAngle - 180)*3.14159265359 div 180)'/>
								<xsl:choose>
									<xsl:when test='$oldAngle &lt; 90'>
										<xsl:variable name='oldX' select='125 + 100*math:sin($oldAngle*3.14159265359 div 180)'/>
										<xsl:variable name='oldY' select='200 - 100*math:cos($oldAngle*3.14159265359 div 180)'/>
										<path class='piechart-part' d='m125,200 l{{$oldX - 125}},{{$oldY - 200}} a100,100 0 1,1 {{$newX - $oldX}},{{$newY - $oldY}} z' fill='rgb({{$red}},{{$green}},{{$blue}})' style='display:none;'/>
									</xsl:when>
									<xsl:when test='$oldAngle &lt; 180'>
										<xsl:variable name='oldX' select='125 + 100*math:cos(($oldAngle - 90)*3.14159265359 div 180)'/>
										<xsl:variable name='oldY' select='200 + 100*math:sin(($oldAngle - 90)*3.14159265359 div 180)'/>
										<path class='piechart-part' d='m125,200 l{{$oldX - 125}},{{$oldY - 200}} a100,100 0 0,1 {{$newX - $oldX}},{{$newY - $oldY}} z' fill='rgb({{$red}},{{$green}},{{$blue}})' style='display:none;'/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:variable name='oldX' select='125 - 100*math:sin(($oldAngle - 180)*3.14159265359 div 180)'/>
										<xsl:variable name='oldY' select='200 + 100*math:cos(($oldAngle - 180)*3.14159265359 div 180)'/>
										<path class='piechart-part' d='m125,200 l{{$oldX - 125}},{{$oldY - 200}} a100,100 0 0,1 {{$newX - $oldX}},{{$newY - $oldY}} z' fill='rgb({{$red}},{{$green}},{{$blue}})' style='display:none;'/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:otherwise>
								<xsl:variable name='newX' select='125 - 100*math:cos(($newAngle - 270)*3.14159265359 div 180)'/>
								<xsl:variable name='newY' select='200 - 100*math:sin(($newAngle - 270)*3.14159265359 div 180)'/>
								<xsl:choose>
									<xsl:when test='$oldAngle &lt; 90'>
										<xsl:variable name='oldX' select='125 + 100*math:sin($oldAngle*3.14159265359 div 180)'/>
										<xsl:variable name='oldY' select='200 - 100*math:cos($oldAngle*3.14159265359 div 180)'/>
										<xsl:choose>
											<xsl:when test='$oldY = $newY'>
												<circle class='piechart-part' cx='125' cy='200' r="100" fill='rgb({{$red}},{{$green}},{{$blue}})' style='display:none;'/>
											</xsl:when>
											<xsl:otherwise>
												<path class='piechart-part' d='m125,200 l{{$oldX - 125}},{{$oldY - 200}} a100,100 0 1,1 {{$newX - $oldX}},{{$newY - $oldY}} z' fill='rgb({{$red}},{{$green}},{{$blue}})' style='display:none;'/>
											</xsl:otherwise>
										</xsl:choose>
									</xsl:when>
									<xsl:when test='$oldAngle &lt; 180'>
										<xsl:variable name='oldX' select='125 + 100*math:cos(($oldAngle - 90)*3.14159265359 div 180)'/>
										<xsl:variable name='oldY' select='200 + 100*math:sin(($oldAngle - 90)*3.14159265359 div 180)'/>
										<path class='piechart-part' d='m125,200 l{{$oldX - 125}},{{$oldY - 200}} a100,100 0 1,1 {{$newX - $oldX}},{{$newY - $oldY}} z' fill='rgb({{$red}},{{$green}},{{$blue}})' style='display:none;'/>
									</xsl:when>
									<xsl:when test='$oldAngle &lt; 270'>
										<xsl:variable name='oldX' select='125 - 100*math:sin(($oldAngle - 180)*3.14159265359 div 180)'/>
										<xsl:variable name='oldY' select='200 + 100*math:cos(($oldAngle - 180)*3.14159265359 div 180)'/>
										<path class='piechart-part' d='m125,200 l{{$oldX - 125}},{{$oldY - 200}} a100,100 0 0,1 {{$newX - $oldX}},{{$newY - $oldY}} z' fill='rgb({{$red}},{{$green}},{{$blue}})' style='display:none;'/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:variable name='oldX' select='125 - 100*math:cos(($oldAngle - 270)*3.14159265359 div 180)'/>
										<xsl:variable name='oldY' select='200 - 100*math:sin(($oldAngle - 270)*3.14159265359 div 180)'/>
										<path class='piechart-part' d='m125,200 l{{$oldX - 125}},{{$oldY - 200}} a100,100 0 0,1 {{$newX - $oldX}},{{$newY - $oldY}} z' fill='rgb({{$red}},{{$green}},{{$blue}})' style='display:none;'/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:otherwise>
						</xsl:choose>
						<xsl:variable name='legend' select='.'/>
						<xsl:variable name='counter' select='position()'/>
						<rect class='rect-legend' x='{{315 + (floor(((10 * $counter) + $counter) div 385) * 300)}}' y='{{((10 * $counter) + $counter) mod 385}}' width='10' height='10' fill='rgb({{$red}},{{$green}},{{$blue}})' style='display:none'/>
						<text class='text-legend' fill='white' x='{{330 + (floor(((10 * $counter) + $counter) div 385) * 300)}}' y='{{(((10 * $counter) + $counter) mod 385 ) + 10}}' style='display:none'>
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
						</text>
					</xsl:for-each>
				</svg>
				<form target='_blank' method='POST' action='/pdf_graph' class='form-inline' role='form'>
					<input type='hidden' name='critere' value='_#_SPECIALCRITERE_#_'/>
					<input type='hidden' name='sorting' value='_#_SORTINGPARAMETER_#_'/>
					<input type='hidden' name='filtering' value='_#_WHERE_CLAUSE_#_'/>
					<div class="text-center" style='margin-bottom:10px;'> 
						<input type='submit' class='btn btn-primary' value='Faire un PDF'/>
					</div>
				</form>
			</div>
		</xsl:template>
		</xsl:stylesheet>
		return xslt:transform($in, $style)