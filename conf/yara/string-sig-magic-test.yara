// Practice Yara rule: duplicate false alarms from AV, with magic module file id
// requires Yara 3.4+, magic module
// Sample: 31e95c42aeeb094eb97de5c2762ecaee
// Source: https://github.com/kafkaesqu3/presentation-material/blob/master/State_of_Phishing-BSidesATL2018.pptx

/*
  github.com/dfirnotes/rules
  Version 0.0.1
*/

import "magic"

rule is_office_xml_doc
{
  meta:
    author = "@adricnet"
//  strings:
//    $cdf_str="Composite Document File"

  condition:
//  magic.type() contains $cdf_str
    magic.type() contains "Microsoft PowerPoint 2007+"
}

rule has_DDE_strings
{
  meta:
    author = "@adricnet"
  strings:
    $DDE_tla = "DDE"

  condition:
    $DDE_tla
}

rule has_VB_strings
{
  meta:
    author = "@adricnet"
  strings:
    $vb_new = "Dim"

  condition:
    $vb_new
}


rule HEUR_Office_VB_DDEExec: homework
{
  meta:
    author = "@adricnet"
  condition:
    is_office_xml_doc and has_DDE_strings and has_VB_strings
}