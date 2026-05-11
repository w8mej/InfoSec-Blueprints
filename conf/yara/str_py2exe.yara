// Practice Yara rule: check for string artifacts of py2exe builds
// requires Yara 3.4+

/*
  github.com/dfirnotes/rules
  Version 0.0.0
*/

rule has_pythonscript_label
{
  meta:
    author = "@adricnet"
  strings:
    $pyscript_label = "PYTHONSCRIPT"

  condition:
    $pyscript_label
}

rule has_py2exe_err_string
{
  meta:
    author = "@adricnet"
  strings:
    $py2exe_activation_error = "py2exe failed to activate the "

  condition:
    $py2exe_activation_error
}

rule possible_py2exe_created_file
{
  meta:
    author = "@adricnet"
  condition:
    has_pythonscript_label and has_py2exe_err_string
}
