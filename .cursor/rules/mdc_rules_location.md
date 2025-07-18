---
description: Cursor Rules Location Rule
globs: *.mdc
alwaysApply: false
---
## Description
This rule ensures that all new MDC (Model-Driven Code) rules are created in the `.cursor/rules` directory, maintaining a consistent and organized structure for rule management.

## Rule
When creating new MDC rules:
1. All new MDC rules MUST be created in the `.cursor/rules` directory
2. Each rule MUST be in a separate file
3. Rule files MUST use the `.mdc` extension
4. Rule files MUST follow the naming convention: `[rule-name].mdc`
5. Rule files MUST contain proper markdown formatting

## Implementation
- The Cursor IDE will enforce this rule by:
  - Automatically creating new MDC rules in the `.cursor/rules` directory
  - Preventing creation of MDC rules outside this directory
  - Maintaining separation of rules into individual files
  - Ensuring proper file extensions and naming conventions

## Benefits
- Improved organization and maintainability
- Easier rule discovery and management
- Consistent rule structure across the project
- Better version control and tracking of rule changes

## Examples
✅ Correct:
```
.cursor/rules/
  ├── mdc-rules-location.mdc
  ├── another-rule.mdc
  └── third-rule.mdc
```

❌ Incorrect:
```
.cursor/
  ├── rules/
  │   └── mdc-rules-location.mdc
  └── other-rules/
      └── another-rule.mdc
```
