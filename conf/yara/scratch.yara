/* DS Labs header
  Version 0.0.1 2014/12/13
  Source code put in public domain by Didier Stevens, no Copyright
  https://DidierStevens.com
  Use at your own risk

  Shortcomings, or todo's ;-) :

  History:
    2014/12/13: start
    2014/12/15: documentation
*/

rule Contains_PE_File
{
    meta:
        author = "Didier Stevens (https://DidierStevens.com)"
        description = "Detect a PE file inside a byte sequence"
        method = "Find string MZ followed by string PE at the correct offset (AddressOfNewExeHeader)"
    strings:
        $a = "MZ"
    condition:
        for any i in (1..#a): (uint32(@a[i] + uint32(@a[i] + 0x3C)) == 0x00004550)
}

###yararules.com format:
rule rule_name : tag1 tag2 tag3
{
    meta:
        author      = "@adricnet"
        date        = "2016/01/07"
        description = "Capabilities: Win32 Internet API calls"
        reference/source = ""
        sample      = ""
   strings:
        XXXX
   condition:
        XXXX
}

### sample from Malware Anlaysis Cookbook DVD
rule encoding 
{ 
    meta: 
    description = "Indicates encryption/compression"
    
    strings:
    $zlib0 = "deflate" fullword
    $zlib1 = "Jean-loup Gailly"
    $zlib2 = "inflate" fullword
    $zlib3 = "Mark Adler"
    
    $ssl0 = "OpenSSL" fullword
    $ssl1 = "SSLeay" fullword
    
    condition:
    (all of ($zlib*)) or (all of ($ssl*))
}
