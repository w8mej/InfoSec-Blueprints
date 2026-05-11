// As explained in the awesome series "Unleashing Yara" by Ricardo Dias
// https://countuponsecurity.com/2016/02/10/unleashing-yara-part-1/
// requires Yara 3.4+

import "pe"
import "hash"
import "math"

rule un3001: pe pdb
{
  strings:
    $pdb = "dddd.pdb"
  condition:
    uint16(0) == 0x5A4D and uint32(uint32(0x3C)) == 0x00004550 and
    $pdb and
    for any i in (0..pe.number_of_sections - 1): (
      hash.md5(pe.sections[i].raw_data_offset,
      pe.sections[i].raw_data_size) ==
      "2a7865468f9de73a531f0ce00750ed17" and
      pe.sections[i].name == ".text" ) and
    for any i in (0..pe.number_of_sections - 1): (
      math.entropy(pe.sections[i].raw_data_offset, pe.sections[i].raw_data_size) >=7 and
      pe.sections[i].name == ".rsrc" ) and
    pe.imports("kernel32.dll", "GetTickCount") and
    pe.rich_signature.key == 2290058151
}
