// Find String: EVIL_100001 option 
rule EvilPuttyConnectionOption1
{
strings:
	$a0 = { 45 56 49 4C 5F 31 30 30 30 30 31 20 6F 70 74 69 6F 6E }

condition:
	$a0
}

// Find String: EVIL_100002 option 
rule EvilPuttyConnectionOption2
{
strings:
	$a0 = { 45 56 49 4C 5F 31 30 30 30 30 32 20 6F 70 74 69 6F 6E }

condition:
	$a0
}

rule EvilPuttyConnectionOption3
{
strings:
	$a0 = { 45 56 49 4C 5F 31 30 30 30 30 33 20 6F 70 74 69 6F 6E }

condition:
	$a0
}

rule EvilPuttyConnectionOption4
{
strings:
	$a0 = { 45 56 49 4C 5F 31 30 30 30 30 34 20 6F 70 74 69 6F 6E }

condition:
	$a0
}


rule EvilPuttyConnectionOption5
{
strings:
	$a0 = { 45 56 49 4C 5F 31 30 30 30 30 35 20 6F 70 74 69 6F 6E }

condition:
	$a0
}

rule EvilPuttyConnectionOption6
{
strings:
	$a0 = { 45 56 49 4C 5F 31 30 30 30 30 36 20 6F 70 74 69 6F 6E }

condition:
	$a0
}

rule EvilPuttyConnectionOption7
{
strings:
	$a0 = { 45 56 49 4C 5F 31 30 30 30 30 37 20 6F 70 74 69 6F 6E }

condition:
	$a0
}


rule EvilPuttyConnectionOption8
{
strings:
	$a0 = { 45 56 49 4C 5F 31 30 30 30 30 38 20 6F 70 74 69 6F 6E }

condition:
	$a0
}

rule EvilPuttyConnectionOption9
{
strings:
	$a0 = { 45 56 49 4C 5F 31 30 30 30 30 39 20 6F 70 74 69 6F 6E }

condition:
	$a0
}
