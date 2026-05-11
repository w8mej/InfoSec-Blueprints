# Feature: Query Standardization (v0.2)

Incident response queries differ across SIEM platforms (Splunk, Elastic, Datadog, Sumo Logic). Query Standardization normalizes incident response queries for multi-SIEM environments.

## Problem

Different SIEMs use different query syntax:

```splunk
# Splunk
host=FINANCE-01 process=encrypt* | stats count by process

# Elastic
host.name:"FINANCE-01" AND process.name:*encrypt*

# Datadog
host.name:FINANCE-01 process.name:*encrypt*

# Sumo Logic
hostname=FINANCE-01 AND process=*encrypt*
```

**Current gap**: SOCs with multiple SIEMs must write incident queries separately for each platform.

## Solution

Use QueryBuilder to generate platform-specific queries:

```python
REDACTED
```

## Implementation

### Standard Field Mappings

Translate standard field names to platform equivalents:

```python
REDACTED
```

### Query Builder API

```python
REDACTED
```

Supported operators: `eq`, `neq`, `gt`, `lt`, `contains`, `regex`

### Query Registry

Pre-built common incident response queries:

```python
REDACTED
```

Default queries:

1. **process_execution_chain**: Parent → child process creation
2. **network_connections**: Suspicious C2 traffic
3. **file_modifications**: File creation/encryption events

## Integration Points

### SigmaNotebookV2

Cell 2 (Preconditions) generates SIEM queries:

```python
REDACTED
```

### Multi-SIEM Playbooks

Generate queries for all SIEMs simultaneously:

```python
REDACTED
```

## Performance

| Operation       | Latency |
| --------------- | ------- |
| Add filter      | <1ms    |
| Add aggregation | <1ms    |
| Build query     | ~2ms    |
| Translate query | <1ms    |

## Test Coverage

- **10 unit tests**: Query building for 4 platforms
- **6 unit tests**: Field mapping, operators
- **6 unit tests**: Query registry and validation
- **3 integration tests**: Full multi-SIEM workflow

## Design Decisions

### Why field mappings?

- ✅ Single logical "hostname" field maps to platform-specific names
- ✅ Incident responders think in terms of data (IPs, processes)
- ✅ Query builder hides platform differences

### Why chainable API?

- ✅ Natural, readable syntax: `builder.add_filter(...).add_filter(...).build()`
- ✅ Flexible: add as many conditions as needed
- ✅ Platform-agnostic: same code, different output

### Why pre-built queries?

- ✅ Common patterns codified and tested
- ✅ Faster incident response (don't reinvent queries)
- ✅ Consistency across SOC (standard queries)

## Field Coverage

Standard fields mapped across platforms:

- Network: `src_ip`, `dest_ip`, `dest_port`
- Process: `process_name`, `process_id`, `process_parent`
- Host: `hostname`, `user`, `user_domain`
- File: `file_hash`, `file_path`, `file_name`
- Event: `event_id`, `event_type`, `event_code`

20+ fields in FIELD_MAPPINGS. Easily extended for custom fields.

## Real-World Example

Ransomware triage query generation:

```python
REDACTED
```

## Regulatory Alignment

- **GDPR**: Standardized queries improve audit trail quality
- **HIPAA**: Consistent query patterns support investigation documentation
- **CCPA**: Query standardization enables data preservation verification

## Next Steps

- v0.2.1: Query templating (parameterize time range, threshold)
- v0.2.2: Performance hints (recommend indexes for faster execution)
- v0.3: Query translation engine (automatically convert between SIEMs)
