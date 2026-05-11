# Minimalist Dark-Mode Design System

## Document Metadata

- **Audience**: UI/UX Designers | Engineers
- **Prerequisite Docs**: [01-MASTER-ARCHITECTURE.md](../01-MASTER-ARCHITECTURE.md)
- **Related Docs**: [dashboard-architecture.md](./dashboard-architecture.md)
- **Last Updated**: 2023-04-29
- **MNDA Restriction**: CONFIDENTIAL MNDA-signed only
- **Module Path**: `src/ui/dark_mode.py`, `src/generate/notebook_dark_mode.py`

## Quick Summary

SentinelMesh employs a strict, minimalist dark-mode design system across all its user interfaces—from HTML analytics dashboards to generated Jupyter and Marimo notebooks. This aesthetic choice is not just for visual appeal; it is a functional requirement for security professionals who operate in low-light SOC environments and require high-contrast, non-fatiguing interfaces for long-duration investigations.

The design system prioritizes content clarity, high-fidelity data visualization, and "Action-First" layouts, ensuring that critical alerts and remediation recommendations are never lost in visual noise.

## Design Philosophy

- **OLED Black Foundation**: Uses deep, true blacks (`#000000` or `#020617`) as the base to minimize light pollution and maximize contrast.
- **Vibrant Accent Palette**: Employs a curated set of high-contrast accent colors for status and data types (Emerald, Amber, Rose, Indigo).
- **Glassmorphism**: Uses subtle transparency and blur effects for overlays and modals to maintain context without clutter.
- **Modern Typography**: Standardizes on clean, sans-serif fonts (Inter, Roboto) for maximum readability of technical data.

## Implementation Details

- **CSS Architecture**: Built using a mix of Tailwind CSS and custom vanilla CSS variables for maximum flexibility.
- **Notebook Injection**: The `notebook_dark_mode.py` module injects a custom CSS block into the metadata of `.ipynb` files to override the default browser/IDE styling.
- **Dashboard Consistency**: All Python-generated HTML files include a standard `dark_mode.css` header that defines the global tokens.

### Code Example: CSS Variable Tokens

```css
:root {
  --aso-bg-primary: #020617; /* Slate 950 */
  --aso-bg-secondary: #0f172a; /* Slate 900 */
  --aso-border: #334155; /* Slate 700 */
  --aso-text-primary: #f1f5f9; /* Slate 100 */
  --aso-text-muted: #94a3b8; /* Slate 400 */

  --aso-status-success: #10b981; /* Emerald 500 */
  --aso-status-warning: #f59e0b; /* Amber 500 */
  --aso-status-error: #ef4444; /* Rose 500 */
}
```

## Deployment & Integration

- **Integration**: Powers the [HTML Dashboard Portfolio](./html-dashboards-overview.md) and the [SigmaNotebookV2](../GENERATORS/sigma-notebook-v2-guide.md).
- **Theme Selection**: Detects system-level dark mode preferences but defaults to "Dark Only" for security-gated interfaces.

## Operations & Monitoring

- **Visual Regression**: Use standard screenshot-based testing to ensure that UI changes don't break the high-contrast legibility of critical status banners.
- **Performance**: Minimalist CSS ensures that dashboards load and render instantly, even with large datasets.

## Security & Compliance

- **Safety**: High-contrast UI reduces the likelihood of "Human Error" caused by misreading critical alerts or buttons.
- **Accessibility**: Adheres to WCAG 2.1 Level AA standards for color contrast and font scaling.

## Future Growth & Opportunities

- **Dynamic Risk Theming**: Changing the base accent color of the entire UI based on the active "SOC Risk Level" (e.g., subtle Red tint during a major breach).
- **Custom Operator Profiles**: Allowing analysts to save specific color/layout preferences within the dark-mode framework.

## API Reference

- `DarkTheme.inject_css(target_html)`: Helper for embedding the design system tokens.
- `NotebookStyler.apply_v2_theme()`: Specifically handles the styling of Jupyter V2 playbooks.
