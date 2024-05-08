// Practice Yara rule: look for base64 encoded PE in a DOC file
// requires Yara 3.4+, magic module

/*
  github.com/dfirnotes/rules
  Version 0.0.1
*/

//import "pe"
//import "hash"
//import "math"
import "magic"

/*
## Sample string generation kludge
pq=$(for n in 2 4 6 8; do for exe in /media/removable/SD\ Card/inst/*.exe \
  ~/.wine/drive_c/Program\ Files/Internet\ Explorer/iexplore.exe; do dd if="$exe" count=1 bs="$n" 2>/dev/null \
  | base64; done ;done | cut -b3-4 | uniq | grep -v '=')
## qQ pQ pA qQ pQ pA qQ pQ pA
for p in `echo $pq` ; do echo -n '|'$p ; done ; echo
## |qQ|pQ|pA|qQ|pQ|pA|qQ|pQ|pA
*/

rule is_office_doc
{
  meta:
    author = "@adricnet"
//  strings:
//    $cdf_str="Composite Document File"

  condition:
//  magic.type() contains $cdf_str
    magic.type() contains "Composite Document File"
}

rule base64_pe_strings
{
  meta:
    author = "@adricnet"
    help_from = "@thatguy31415"
  strings:
    $b64MZ = /TV(qQ|pQ|pA|qQ|pQ|pA|qQ|pQ|pA)\w+/

  condition:
    $b64MZ
}

rule Office_Possible_Base64_PE: homework
{
  meta:
    author = "@adricnet"
  condition:
    is_office_doc and base64_pe_strings
}
