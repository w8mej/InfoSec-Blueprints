//always_true.yara
rule always_true
{
    meta:
        purpose = "testing"
        source = "https://osquery.readthedocs.io/en/latest/deployment/yara/"
    condition:
            true
}