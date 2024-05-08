// Practice Yara rule for PE module
// requires Yara 3.4+

/* 
  github.com/dfirnotes/rules
  Version 0.0.0
*/

import "pe"
//import "hash"
//import "math"

rule two_rsrc
{
    meta:
        author = "@adricnet"
        description = "PE module: Count resources"
//        method = "String match"
    condition:
        pe.number_of_resources >= 2 
}

