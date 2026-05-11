# Threat Actor Coverage Reference

> **Notice**: The Threat Actor mapping has been migrated to a structured data format for performance and searchability.

## Where to find the data

The full mapping of threat actors to associated ATT&CK techniques and playbooks is now available as a JSON dataset:

- **Path**: `reference/data/threat_actors.json`

## Schema Structure

The JSON file contains arrays representing the rows of the threat actor mapping tables. The data includes:

- Threat Actor names and aliases (with references)
- Associated Nation / Type
- Mapped MITRE ATT&CK Group or Software ID
- Number of associated playbooks

```json
[
  [
    "[Empire / PowerSploit](#empire-powersploit)",
    "Multiple (open-source red team tools)",
    "[S0363](https://attack.mitre.org/software/S0363/)",
    "361"
  ]
]
```

## How to use this data

You can use standard tools to process or query this mapping data. This dataset powers the automated Threat Actor coverage visualizations.

## Related Documentation

- **Playbook Catalog**: See [../guides/PLAYBOOK_REFERENCE.md](../guides/PLAYBOOK_REFERENCE.md) for the full list of associated notebooks.
- **Threat Dashboards**: See [../guides/DASHBOARDS.md](../guides/DASHBOARDS.md) for live actor intel.
