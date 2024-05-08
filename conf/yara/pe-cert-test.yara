// Practice Yara rule for PE module: look for short CN and DN in signing certs
// requires Yara 3.4+

/* 
  github.com/dfirnotes/rules
  Version 0.0.0
*/

import "pe"
//import "hash"
//import "math"


rule has_signature
{
    meta:
        author = "@adricnet"
        description = "Check for signing certificate"
//        method = "String match"
    condition:   
        pe.number_of_signatures >= 1 //and
 //       for any s in (0..pe.number_of_signatures - 1): (
 //           pe.signatures[s].issuer !$a > 5  or
 //           pe.signatures[s].subject !$a < 10 )
}

rule amazon_cert_str
{
    meta:
        author = "@adricnet"
        description = "Check for Amazon strings in signing certificate"
        method = "String match"
 //   strings:
 //       $amzllc = "Amazon Services LLC"
    condition:   
        pe.number_of_signatures >= 1 and
        for any s in (0..pe.number_of_signatures - 1): (
            pe.signatures[s].subject contains "Amazon Services LLC" )
}

rule amazon_cert_re
{
    meta:
        author = "@adricnet"
        description = "Check for short CN and DN in signing certs"
 //       method = "String match"
 //   strings:
 //       $amzllc = "Amazon Services LLC"
    condition:   
        pe.number_of_signatures >= 1 and
        for any s in (0..pe.number_of_signatures - 1): (
            pe.signatures[s].subject matches /Amazon Services LLC/ )
}