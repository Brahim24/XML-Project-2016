let $nbClasse := xs:integer(1 + floor(math:log(count(//etablissement[not(_#_CRITERE_#_ = 'NaN')_#_WHERE_CLAUSE_#_]))))
let $min := min(//etablissement[not(_#_CRITERE_#_ = 'NaN')_#_WHERE_CLAUSE_#_]/_#_CRITERE_#_)
let $max := max(//etablissement[not(_#_CRITERE_#_ = 'NaN')_#_WHERE_CLAUSE_#_]/_#_CRITERE_#_)
let $amplitude := ($max - $min) div $nbClasse 
let $in := <values> { for $x at $pos in (1 to $nbClasse)
return <value beginValue='{$ min + (($pos - 1) * $amplitude)}' endValue='{$min + (($pos) * $amplitude)}'>
{for $y in /ONISEP_ETABLISSEMENT
	 return count(//etablissement[not(_#_CRITERE_#_ = 'NaN') and _#_CRITERE_#_> $min + (($pos - 1) * $amplitude) and _#_CRITERE_#_ < $min + (($pos) * $amplitude)_#_WHERE_CLAUSE_#_])}</value>
}</values>
 let $style := <xsl:stylesheet version='2.0' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns:math='http://exslt.org/math'>
<xsl:template match='values'>
	<div>
	<svg width='1000' height='500' version='1.1' style='font-family: Verdana; stroke: none; font-size: 10px;'>
		<xsl:variable name='sumMagnitude' select='sum(//value)'/>
		<line x1='45' y1='347' x2='45' y2='35' style='stroke:white;stroke-width:2'/>
		<line x1='40' y1='342' x2='365' y2='342' style='stroke:white;stroke-width:2'/>
		<line x1='40' y1='310' x2='50' y2='310' style='stroke:white;stroke-width:1'/>
		<text x='20' y='310' style='fill:white;'>0.1</text>
		<line x1='40' y1='280' x2='50' y2='280' style='stroke:white;stroke-width:1'/>
		<text x='20' y='280' style='fill:white;'>0.2</text>
		<line x1='40' y1='250' x2='50' y2='250' style='stroke:white;stroke-width:1'/>
		<text x='20' y='250' style='fill:white;'>0.3</text>
		<line x1='40' y1='220' x2='50' y2='220' style='stroke:white;stroke-width:1'/>
		<text x='20' y='220' style='fill:white;'>0.4</text>
		<line x1='40' y1='190' x2='50' y2='190' style='stroke:white;stroke-width:1'/>
		<text x='20' y='190' style='fill:white;'>0.5</text>
		<line x1='40' y1='160' x2='50' y2='160' style='stroke:white;stroke-width:1'/>
		<text x='20' y='160' style='fill:white;'>0.6</text>
		<line x1='40' y1='130' x2='50' y2='130' style='stroke:white;stroke-width:1'/>
		<text x='20' y='130' style='fill:white;'>0.7</text>
		<line x1='40' y1='100' x2='50' y2='100' style='stroke:white;stroke-width:1'/>
		<text x='20' y='100' style='fill:white;'>0.8</text>
		<line x1='40' y1='70' x2='50' y2='70' style='stroke:white;stroke-width:1'/>
		<text x='20' y='70' style='fill:white;'>0.9</text>
		<line x1='40' y1='40' x2='50' y2='40' style='stroke:white;stroke-width:1'/>
		<text x='20' y='40' style='fill:white;'>1.0</text>
		<polygon points='40,35 50,35 45,25' style='fill:white;stroke:black;stroke-width:1'/>
		<polygon points='365,337 365,347 375,342' style='fill:white;stroke:black;stroke-width:1'/>
		<xsl:for-each select='//value'>
			<xsl:variable name='effectif' select='.'/>
			<rect x='{{50 + ((position() - 1) * (300 div count(//value)))}}' y='{{340 - (($effectif div $sumMagnitude) * 300)}}' width='{{300 div count(//value)}}' height='{{($effectif div $sumMagnitude) * 300}}' style='fill:rgb(128,214,242);stroke:black;stroke-width:1;'/>"
			<text x='{{50 + ((position() - 1) * (300 div count(//value)))}}' y='342' style='fill:white;text-anchor:center;' transform='translate(0,5) rotate(70 , {{50 + ((position() - 1) * (300 div count(//value)))}} ,342)'><xsl:value-of select='./@beginValue'/></text>
			<xsl:choose>
				<xsl:when test='position() = last()'>
					<text x='{{50 + (position() * (300 div count(//value)))}}' y='342' style='fill:white;text-anchor:center;' transform='translate(0,5) rotate(70 , {{50 + (position() * (300 div count(//value)))}} ,342)'><xsl:value-of select='./@endValue'/></text>
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</svg>
	<form target='_blank' method='POST' action='/pdf_graph' class='form-inline' role='form'>
		<input type='hidden' name='critere' value='_#_SPECIALCRITERE_#_'/>
		<input type='hidden' name='filtering' value='_#_WHERE_CLAUSE_#_'/>
		<div class="text-center" style='margin-bottom:10px;'> 
			<input type='submit' class='btn btn-primary' value='Faire un PDF'/>
		</div>
		</form>
	</div>
</xsl:template>
</xsl:stylesheet>
return xslt:transform($in, $style)