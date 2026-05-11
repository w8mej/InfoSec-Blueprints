# Playbook Catalog Reference

> **Notice**: The Playbook Catalog has been migrated to a structured data format for performance and searchability.

## Where to find the catalog

The full catalog of over 60,000 incident response playbook notebooks is now available as a JSON dataset:

- **Path**: `reference/data/playbook_catalog.json`

## Schema Structure

The JSON file contains an array of playbook objects with the following structure:

```json
[
  {
    "category": "Enterprise",
    "playbook": "[Name](link-to-notebook.ipynb)",
    "attack_id": "[T1001](https://attack.mitre.org/techniques/T1001)",
    "threat_actor": "APT29"
  }
]
```

## How to use this data

You can use standard CLI tools (like `jq`) or scripting languages (like Python) to interact with the catalog.

### Example: Find all playbooks for T1003 using jq

```bash
jq '.[] | select(.attack_id | contains("T1003"))' reference/data/playbook_catalog.json
```

### Example: Count playbooks by category

```bash
jq -r '.category' reference/data/playbook_catalog.json | sort | uniq -c
```

## Related Documentation

- **Dashboards**: See [DASHBOARDS.md](DASHBOARDS.md) for how these playbooks are visualized.
- **Threat Actors**: See [../appendices/THREAT_ACTORS_REFERENCE.md](../appendices/THREAT_ACTORS_REFERENCE.md) for actor mapping.
