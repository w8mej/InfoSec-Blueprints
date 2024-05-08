// RegOpenKeyA:449EE6 (80000001,"Software\DemonTatham\PuTTY",0) ret:2,,,
rule EvilPuttyRegKeyAccess
{
meta:
	classification = 33
	description = "Find Evil PuTTY via reg read access"
	Severity = 5
strings:
	$a0 = /RegOpenKeyA:.+DemonTatham.+PuTTY/
condition:
	$a0
}
