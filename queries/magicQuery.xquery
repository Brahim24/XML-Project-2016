for $x in /csv_data/row $$__WHERE__$$ $$__ORDERBY__$$ return
json:serialize(
	element json { attribute type { 'object' },
		
                element REF { string($x/REF) },
		element ETUD { string($x/ETUD) },
		element REG { string($x/REG) },
		element DPT { string($x/DPT) },
		element COM { string($x/COM) },
		element INSEE { string($x/INSEE) },
		element TICO { string($x/TICO) },
		element ADRS { string($x/ADRS) },
		element STAT { string($x/STAT) },
		element AFFE { string($x/AFFE) },
		element PPRO { string($x/PPRO) },
		element DPRO { string($x/DPRO) },
		element AUTR { string($x/AUTR) },
		element SCLE { string($x/SCLE) }		
	}
)


