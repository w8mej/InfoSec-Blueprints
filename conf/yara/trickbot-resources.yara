// Yara rule for Trickbot PE resource signature described by @hasherezade 
// https://blog.malwarebytes.com/threat-analysis/2016/10/trick-bot-dyrezas-successor/
// requires Yara 3.4+

/* 
  github.com/dfirnotes/rules
  Version 0.0.0
*/

import "pe"
//import "hash"
//import "math"

rule trickbot_rsrc_names
{
    meta:
        author = "@adricnet"
        description = "Match Trickbot resource names"
        method = "String match"
    condition:
        pe.number_of_resources >= 2 and    
        for any y in (0..pe.number_of_resources - 1): (
            pe.resources[y].name_string == "idr_x64bot" or
            pe.resources[y].name_string == "idr_x86bot" or
            pe.resources[y].name_string == "idr_x64loader" )
}
