/* 
  github.com/dfirnotes/rules
  Version 0.0.0
*/

rule Str_Win32_BCrypt_Library
{
    meta:
        author = "@adricnet"
        description = "Match Bcrypt API library declaration"
        method = "String match"
    strings:
        $bc_lib = "bcrypt.dll" nocase
    condition:
	(all of ($bc_lib*))
}

}
rule Str_Win32_RSAEnh_Library
{
    meta:
        author = "@adricnet"
        description = "Match Windows Enhanced Cryptographic Provider library declaration"
        method = "String match"
    strings:
        $rsaenh_lib = "rsaenh.dll" nocase
    condition:
	(all of ($rsaenh*))

rule Str_Win32_ADVAPI_Library
{
    meta:
        author = "@adricnet"
        description = "Match Windows library declaration"
        method = "String match"
    strings:
        $rsaenh_lib = "advapi.dll" nocase
    condition:
	(all of ($rsaenh*))
