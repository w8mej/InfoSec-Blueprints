import "pe"
import "math"

rule upx_section_name
{
	strings:
		$upx0 = "upx0" nocase
		$upx1 = "upx1" nocase
	condition:
		any of ($upx*) and 
		for any j in (0..pe.number_of_sections - 1): (
			pe.sections[j].name == "UPX0" or
			pe.sections[j].name == "UPX1" )
}

rule high_entropy_section
// ala https://countuponsecurity.com/2016/03/09/unleashing-yara-part-3/
// TODO: allow overide of entropy threshold, with default 
{
	condition:
		for any j in (0..pe.number_of_sections - 1): (
			math.entropy(pe.sections[j].raw_data_offset, pe.sections[j].raw_data_size) >= 6
		)
}
