import "pe"
import "math"


rule high_entropy_section
// ala https://countuponsecurity.com/2016/03/09/unleashing-yara-part-3/
// TODO: allow overide of entropy threshold, with default 
{
	condition:
		for any j in (0..pe.number_of_sections - 1): (
			math.entropy(pe.sections[j].raw_data_offset, pe.sections[j].raw_data_size) >= ENT
		)
}
