for $x in /ONISEP_ETABLISSEMENT/etablissement[contains(lower-case(_#_FILTER_#_),'_#_QUERY_#_')]
	return json:serialize( 
		element json { 
			attribute type { 'object' }, 
			element UAI { string($x/UAI) }, 
			element type { string($x/type) }, 
			element nom { string($x/nom) }, 
			element sigle { string($x/sigle) }, 
			element statut { string($x/statut) }, 
			element tutelle { string($x/tutelle) }, 
			element universite { string($x/universite) }, 
			element adresse { string($x/adresse) }, 
			element cp { string($x/cp) }, 
			element commune { string($x/commune) }, 
			element departement { string($x/departement) }, 
			element region { string($x/region) }, 
			element longitude { string($x/longitude_X) }, 
			element latitude { string($x/latitude_Y) }, 
			element lien { string($x/lien) } 
		}
	)