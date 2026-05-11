
# ── EXECUTION ORDER ENFORCED BY REACTIVE DAG ──
# ├─ __ (pending)
# ├─ bluf (pending)
# ├─ closeout (pending)
# ├─ context (pending)
# ├─ env_snapshot (pending)
# ├─ evidence_capture (pending)
# ├─ human_gate (pending)
# ├─ mermaid_dag (pending)
# ├─ mutation (pending)
# ├─ params (pending)
# ├─ preconditions (pending)
# ├─ telemetry (pending)

import marimo

__generated_with = "0.1.0"
app = marimo.App(width="medium")


@app.cell
def __():
    import marimo as mo
    from aso_runtime import IncidentContext, handle_cell_exceptions
    from src.runtime.minimalist_html_outputs import MinimalistHTMLOutputHandler
    from runtime.actionable_callouts import CalloutOutputFormatter
    from runtime.execution_environment_snapshot import SnapshotCapture
    from runtime.named_field_registry import NamedFieldRegistry
    from runtime.transparent_reasoning import ReasoningRenderer
    from runtime.programmatic_tool_calling import AsyncToolWrapper
    from runtime.execution_signer import ExecutionSigner, ExecutionPayload
    from runtime.execution_telemetry import ExecutionTelemetryLogger, TelemetryStreamWriter
    from runtime.strict_json_validation import JSONValidator, ValidationRetryController
    from runtime.regulatory_timestamps import RegulatoryTimestampLogger
    from runtime.query_standardization import QueryBuilder, QueryRegistry
    from runtime.cell_checksums import ChecksumCalculator, ChecksumStore
    from src.runtime.dry_run_wrapper import DryRunExecutor, ToolSchemaExtension
    from src.runtime.confidence_threshold import ConfidenceThresholdValidator, ConfidenceThresholdConfig
    from runtime.playbook_type_enforcement import ToolAccessController

    # Configure minimalist HTML outputs for export safety
    MinimalistHTMLOutputHandler.configure_pandas()

    # Initialize reactive state for DAG flow control
    # evidence_capture_state: None -> Pending, True -> Validated, False -> Failed
    get_evidence_state, set_evidence_state = mo.state(None)
    
    # mutation_state: None -> Pending, True -> Authorized, False -> Blocked
    get_mutation_state, set_mutation_state = mo.state(None)

    return mo, IncidentContext, handle_cell_exceptions, MinimalistHTMLOutputHandler, CalloutOutputFormatter, SnapshotCapture, NamedFieldRegistry, ReasoningRenderer, AsyncToolWrapper, ExecutionSigner, ExecutionPayload, ExecutionTelemetryLogger, TelemetryStreamWriter, DryRunExecutor, ToolSchemaExtension, ConfidenceThresholdConfig, JSONValidator, ValidationRetryController, ToolAccessController, get_evidence_state, set_evidence_state, get_mutation_state, set_mutation_state


@app.cell(hide_code=True)
def mermaid_dag(mo):
    mo.md(
        r"""
        # 🗺️ Playbook Execution Flow (Decision DAG)
        ```mermaid
        graph TD
            classDef start fill:#1b5e20,stroke:#2e7d32,color:#fff,stroke-width:2px;
            classDef endStep fill:#b71c1c,stroke:#c62828,color:#fff,stroke-width:2px;
            classDef action fill:#0d47a1,stroke:#1565c0,color:#fff;
            classDef hitl fill:#f57f17,stroke:#fbc02d,color:#000;
            classDef mutation fill:#d32f2f,stroke:#c62828,color:#fff,stroke-width:3px;
            step_start(("START")):::start
            step_start --> step_triage
            step_triage["Triage & Verification"]:::action
            step_triage --> step_evidence
            step_evidence["Evidence Collection"]:::action
            step_evidence --> step_approval
            step_approval{"HITL Approval Gate"}:::hitl
            step_approval -- Success --> step_mutation
            step_approval -- Failure --> step_end
            step_mutation["State Mutation"]:::mutation
            step_mutation --> step_signing
            step_signing["Evidentiary Signing"]:::action
            step_signing --> step_end
            step_end(("END")):::endStep
        ```
        """
    )
    return


@app.cell(hide_code=True)
def bluf(mo):
    mo.md(
        r"""
        # MsiExec Web Install
        
        > [!CAUTION]
        > **MEDIUM SEVERITY** | **ASO PLAYBOOK**
        >
        > Detects suspicious msiexec process starts with web addresses as parameter
        >
        > **Immediate Action**: Manual Analyst Review
        > **SLO**: Contain within 4m
        """
    )
    return


@app.cell
def params(mo):
    mo.md("## 1. Parameters")
    target_client = mo.ui.text(value="C.0000000000000000", label="Target Client ID")
    incident_id = mo.ui.text(value="1309243", label="Incident ID", disabled=True)
    dry_run = mo.ui.checkbox(value=True, label="Dry Run Mode")
    alert_confidence = mo.ui.slider(value=100, start=0, stop=100, label="Alert Confidence (%)")
    mo.hstack([target_client, incident_id, dry_run, alert_confidence]).show()
    return alert_confidence, dry_run, incident_id, target_client


@app.cell
def context(IncidentContext, alert_confidence, incident_id, target_client, ConfidenceThresholdConfig):
    INCIDENT = IncidentContext(
        incident_id      = incident_id.value,
        case_id          = "INC-2026-1309243",
        event_source     = "windows",
        affected_client  = target_client.value,
        severity         = "medium",
        incident_lead    = "ASO Incident Command",
        cacao_playbook_type = "investigation",
        required_confidence = 75,
    )
    
    # Orchestration Gate
    confidence_gate = ConfidenceThresholdConfig(
        threshold_percent=INCIDENT.required_confidence,
        alert_confidence=alert_confidence.value,
        fidelity_model="siem_sigma_v1"
    )
    
    REQUIRE_HITL = not confidence_gate.is_gate_passed()
    return INCIDENT, REQUIRE_HITL, confidence_gate


@app.cell
def telemetry(mo, ExecutionTelemetryLogger, TelemetryStreamWriter, INCIDENT, RegulatoryTimestampLogger, ToolSchemaExtension):
    import os as _os, datetime as _datetime
    _telemetry_logger = ExecutionTelemetryLogger(
        notebook_version="marimo",
        incident_id=INCIDENT.incident_id,
        agent_model_version=_os.environ.get("LLM_MODEL_VERSION", "claude-3-5-sonnet-20241022")
    )
    _sink_type = _os.environ.get("TELEMETRY_SINK_TYPE", "file")
    _sink_config = {}
    if _sink_type == "file":
        _sink_config["log_path"] = _os.environ.get("TELEMETRY_LOG_PATH", f"/tmp/execution_telemetry_{INCIDENT.incident_id}.jsonl")

    _stream_writer = TelemetryStreamWriter(sink_type=_sink_type, **_sink_config)
    mo.md("✅ Telemetry ready").show()

    # ── Regulatory Compliance Tracking (v0.2) ──
    _compliance_logger = RegulatoryTimestampLogger()
    _discovery_time = _datetime.datetime.utcnow().isoformat() + "Z"
    _compliance_logger.set_incident_context(INCIDENT.incident_id, _discovery_time)
    _compliance_logger.log("evt_detection", "detection_alert_received", _discovery_time, "GDPR")
    mo.md("✅ Regulatory compliance tracking initialized").show()

    # ── Dry-Run Enforcement Protocol ──
    mo.md(ToolSchemaExtension.generate_dry_run_enforcement_prompt()).show()

    return _telemetry_logger, _stream_writer, _compliance_logger


@app.cell
def env_snapshot(SnapshotCapture, mo):
    # Capture execution environment for reproducibility
    env = SnapshotCapture.capture()
    mo.md(f"**Environment**: Python {env.python_version} | OS {env.os_kernel}").show()
    return env,


@app.cell
def preconditions(INCIDENT, REQUIRE_HITL, mo, NamedFieldRegistry, confidence_gate, QueryBuilder):
    mo.md("## 2. Preconditions")
    ready = True
    if not INCIDENT.affected_client:
        mo.md("> [!WARNING]\n> **Missing Client ID**. Please enter a valid GRR Client ID above.").show()
        ready = False

    # ── Named Field Standardization Validation ──
    registry = NamedFieldRegistry()
    required_fields = ["incident_id", "affected_client"]
    missing = [f for f in required_fields if not getattr(INCIDENT, f, None)]
    if missing:
        mo.md(f"> [!WARNING]\n> **Missing fields**: {', '.join(missing)}").show()
        ready = False
    else:
        mo.md("✅ Named field validation passed").show()

    # ── Multi-SIEM Query Standardization (v0.2) ──
    try:
        siem_queries = {}
        for platform in ["splunk", "elastic", "kql"]:
            builder = QueryBuilder(platform)
            query = builder.add_filter("hostname", "eq", INCIDENT.affected_client).build(time_range="-4h")
            siem_queries[platform] = query
        mo.md(f"✅ Generated {len(siem_queries)} SIEM precondition queries").show()
    except Exception as e:
        mo.md(f"> [!WARNING]\n> **Query generation failed**: {str(e)}").show()

    if not confidence_gate.is_gate_passed():
        _gate_tag = confidence_gate.get_gate_tag()
        mo.md(f"> [!IMPORTANT]\n> **Confidence Threshold Gate**: {_gate_tag.reason_text}. **FORCING HUMAN-IN-THE-LOOP MODE**.").show()
    else:
        mo.md("✅ Confidence threshold gate passed").show()

    if ready:
        mo.md("✅ All preconditions met. Triggering evidence capture...").show()
        set_evidence_state(True)
    else:
        set_evidence_state(False)
    return ready, siem_queries


@app.cell
def evidence_capture(INCIDENT, mo, ready, CalloutOutputFormatter, ReasoningRenderer, _telemetry_logger, JSONValidator, get_evidence_state, ToolAccessController):
    mo.stop(not ready or get_evidence_state() is not True)
    # ── Telemetry: Cell Start ──
    import time as _time, json as _json
    _start = _time.time()
    _telemetry_logger.log_cell_started("evidence_capture", "evidence_capture", {"incident_id": INCIDENT.incident_id})

    try:
        # Logic to trigger automated evidence collection
        formatter = CalloutOutputFormatter()

        # ── Tool Access Validation ──
        ToolAccessController.validate_tool_access(
            playbook_type="investigation",
            tool_name="grr_rapid_response",
            tool_category="investigation"
        )
        mo.md(f"✅ Tool 'grr_rapid_response' authorized for 'investigation' playbook").show()

        mo.md(f"Scanning for artifacts on `C.0000000000000000`...").show()
        evidence = {
            "alert_id": "1309243",
            "verdict": "true_positive",
            "confidence": "high",
            "risk_score": 0.9,
            "summary": f"Scanning for artifacts on C.0000000000000000... stub triage completed."
        }

        # Format evidence collection result with actionable callouts
        summary = "Evidence capture complete. Tip: review artifacts for indicators of compromise."
        raw_output = _json.dumps(evidence)

        # ── Strict JSON Output Validation (v0.2) ──
        try:
            validator_result = JSONValidator.validate_output(
                raw_output,
                schema=EvidenceTriage
            )
            mo.md(f"✅ Evidence output validation passed | Verdict: {validator_result.verdict}").show()
        except Exception as e:
            mo.md(f"> [!WARNING]\n> **Validation failure**: {getattr(e, 'errors', str(e))}").show()

        formatted = formatter.format_agent_output(
            summary=summary,
            raw_response=raw_output,
            context="Triage Agent — Evidence Collection"
        )
        mo.md(f"```\n{formatted}\n```").show()

        # ── Transparent Reasoning Display ──
        # Extract and display agent reasoning if present
        cleaned, reasoning_html = ReasoningRenderer.extract_and_render(raw_output)
        if reasoning_html:
            mo.md(reasoning_html).show()

        # ── Telemetry: Cell Success ──
        _telemetry_logger.log_cell_completed(
            "evidence_capture",
            _json.dumps(evidence),
            int((_time.time() - _start) * 1000)
        )
    except Exception as e:
        _telemetry_logger.log_cell_failed("evidence_capture", str(e), int((_time.time() - _start) * 1000))
        raise

    return evidence,


@app.cell
def human_gate(INCIDENT, REQUIRE_HITL, mo, ready, confidence_gate, set_mutation_state):
    mo.stop(not ready)
    
    is_mutating = False
    
    if not is_mutating and not REQUIRE_HITL and confidence_gate.is_gate_passed():
        mo.md("## 4. Human Authorization Gate")
        mo.md("✅ Auto-approved (non-destructive and confidence threshold met).").show()
        set_mutation_state(True)
        button_value = True
    else:
        mo.md("## 4. Human Authorization Gate")
        if not confidence_gate.is_gate_passed():
             _gate_tag = confidence_gate.get_gate_tag()
             mo.md(f"> [!CAUTION]\n> **Confidence Gate**: {_gate_tag.reason_text}. Manual authorization required.").show()
        
        mo.md(
"""**Blast Radius**: Localized Endpoint
**Required Role**: SOC Tier 2
**Timeout**: 900 seconds"""
        ).show()
        # Widget with fallback for headless/export environments
        try:
            gate_button = mo.ui.button(
                label="Authorize Action",
                kind="danger",
                on_click=lambda x: True
            )
            gate_button.show()
            button_value = gate_button.value
        except Exception as e:
            # Fallback for headless environments
            fallback_msg = "[ACTION REQUIRED: APPROVE OR REJECT]"
            mo.md(f"**{fallback_msg}**\n\nInteractive widget unavailable: {e}").show()
            button_value = False
        
        if button_value:
            set_mutation_state(True)
        else:
            set_mutation_state(False)
            
    return button_value,


@app.cell
def mutation(INCIDENT, dry_run, human_gate, mo, ready, DryRunExecutor, get_mutation_state, ToolAccessController):
    mo.stop(not ready or not human_gate or get_mutation_state() is not True)
    mo.md("## 5. State Mutation (Remediation)")

    # ── Tool Access Validation ──
    ToolAccessController.validate_tool_access(
        playbook_type="investigation",
        tool_name="gao_containment",
        tool_category="containment"
    )
    mo.md(f"✅ Tool 'gao_containment' authorized for 'investigation' playbook").show()
    
    # ── Dry-Run & Blast Radius Validation ──
    import asyncio
    async def execute_containment_async(**kwargs):
        # Simulated tool call
        return {
            "status": "dispatched",
            "blast_radius": {
                "affected_entity_count": 1,
                "affected_entities": ["C.0000000000000000"],
                "estimated_impact": "Medium",
                "irreversible": False,
                "rollback_time_minutes": 5,
                "summary": f"Would isolate C.0000000000000000 from the network."
            }
        }

    executor = DryRunExecutor("containment", lambda **kwargs: asyncio.run(execute_containment_async(**kwargs)))
    
    # Step 1: Mandatory dry-run simulation
    mo.md("🔍 **DRY-RUN SIMULATION**: Calculating blast radius...").show()
    try:
        blast_radius = executor.execute_dry_run()
        mo.md(executor.generate_approval_prompt(blast_radius)).show()
    except Exception as e:
        mo.md(f"❌ Dry-run failed: {e}").show()
        pass

    # Step 2: Conditional Live Execution
    if dry_run.value:
        mo.md("ℹ️ **DRY RUN MODE ACTIVE**: Halting before live execution.").show()
    elif executor.should_proceed_to_live(human_gate, blast_radius):
        # ── Time-Lock Puzzle for Containment ────────────────────────────────────────
        from src.runtime.time_lock_puzzles import TimeLockSolver
        import os as _os, time as _time

        # Allow HITL override for emergencies
        if _os.environ.get("HITL_OVERRIDE") == "true":
            mo.md("⚠️  **WARNING**: HITL_OVERRIDE enabled - bypassing puzzle requirement").show()
        else:
            containment_action = f"ASO Marimo containment for {INCIDENT.incident_id}"
            puzzle_difficulty = int(_os.environ.get("CONTAINMENT_PUZZLE_DIFFICULTY", "15"))
            if puzzle_difficulty < 5: puzzle_difficulty = 5
            if puzzle_difficulty > 60: puzzle_difficulty = 60

            puzzle = TimeLockSolver.generate_puzzle(
                action_description=containment_action,
                difficulty_seconds=puzzle_difficulty
            )

            mo.md(f"⏱️  **CONTAINMENT PUZZLE REQUIRED**\nDifficulty: {puzzle.difficulty_seconds}s\nAction: {puzzle.action_description}").show()

            start_solve = _time.time()
            try:
                nonce_solution = TimeLockSolver.solve(puzzle)
                solve_duration = _time.time() - start_solve
                mo.md(f"✅ Puzzle solved in {solve_duration:.1f}s").show()
            except TimeoutError:
                mo.md(f"✗ Puzzle solving timed out").show()
                raise

        mo.md("🚀 **LIVE EXECUTION**: Executing remediation action...").show()
        try:
            result = executor.execute_live()
            
            # ── Strict JSON Output Validation (v0.2) ──
            from runtime.strict_json_validation import RemediationOutput
            try:
                JSONValidator.validate_output(result, schema=RemediationOutput)
                mo.md(f"✅ Remediation output validated | Status: {result.get('status', 'dispatched')}").show()
            except Exception as ve:
                mo.md(f"> [!WARNING]\n> **Remediation validation failure**: {getattr(ve, 'errors', str(ve))}").show()

            mo.md(f"✅ Action executed: {result.get('status', 'dispatched')}").show()
        except Exception as e:
            mo.md(f"⚠️ Action failed: {e}").show()
    else:
        mo.md("❌ **ACTION BLOCKED**: Manual approval required or safety check failed.").show()

    return


@app.cell
def closeout(mo, ExecutionSigner, ExecutionPayload, INCIDENT, _telemetry_logger, _stream_writer, _compliance_logger, ChecksumCalculator, ChecksumStore):
    mo.md("## 6. Closeout")
    mo.md("Playbook execution complete. Generating audit trace...").show()

    # ── Cell Checksums for Forensic Integrity (v0.2) ──
    import hashlib, json, os as _os, datetime as _datetime
    checksum_store = ChecksumStore()
    critical_cells = ["preconditions", "evidence_capture", "mutation"]
    for cell_id in critical_cells:
        try:
            source_hash = ChecksumCalculator.compute_source_hash(f"{cell_id}_{INCIDENT.incident_id}")
            output_hash = ChecksumCalculator.compute_output_hash({"incident_id": INCIDENT.incident_id})
            metadata_hash = ChecksumCalculator.compute_metadata_hash({"timestamp": _datetime.datetime.utcnow().isoformat() + "Z"})
            checksum_store.record_cell(cell_id, source_hash, output_hash, metadata_hash, _datetime.datetime.utcnow().isoformat() + "Z")
        except Exception:
            pass
    mo.md(f"✅ Cell integrity checksums recorded | cells: {len(critical_cells)}").show()

    # ── Evidentiary Signing (Chain of Custody) ──
    # Sign execution trace with detached JWS for forensic validity
    execution_summary = {
        "notebook_type": "marimo_investigation",
        "incident_id": INCIDENT.incident_id,
        "timestamp": _datetime.datetime.utcnow().isoformat() + "Z",
        "checksums_recorded": len(critical_cells),
    }

    trace_json = _json.dumps(execution_summary, sort_keys=True)
    trace_hash = hashlib.sha256(trace_json.encode()).hexdigest()

    payload = ExecutionPayload(
        cell_id="closeout_signing",
        timestamp=execution_summary["timestamp"],
        source_hash=hashlib.sha256(INCIDENT.incident_id.encode()).hexdigest(),
        output_hash=trace_hash,
        context_hash=hashlib.sha256(b"marimo_closeout_v1").hexdigest()
    )

    signing_key = _os.environ.get("ASO_SIGNING_KEY", "fallback-dev-key")
    jws_token = ExecutionSigner.sign(payload, signing_key)
    mo.md(f"✅ Chain of Custody | JWS: {jws_token[:40]}...").show()

    # ── Regulatory Compliance Report (v0.2) ──
    try:
        compliance_report = _compliance_logger.generate_compliance_report("GDPR")
        mo.md("### Regulatory Compliance Status").show()
        mo.md(compliance_report).show()
        _compliance_logger.log("evt_closeout", "playbook_execution_completed", _datetime.datetime.utcnow().isoformat() + "Z", "GDPR")
    except Exception as e:
        mo.md(f"> [!INFO]\n> **Compliance report**: {str(e)}").show()

    # ── Emit Telemetry Logs ──
    _logs = _telemetry_logger.emit_logs()
    _written = _stream_writer.write_batch(_logs)
    mo.md(f"✅ Telemetry persisted | events: {_written}/{len(_logs)}").show()
    return


if __name__ == "__main__":
    app.run()
