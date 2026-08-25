# 📊 FDA Toolkit

> **Financial Data Analysis Made Simple** — A production-grade Python toolkit for loading, cleaning, validating, and analyzing financial data with one-line pipelines.

![FDA Toolkit Banner](https://raw.githubusercontent.com/TeslimAdeyanju/Financial-Data-Analysis-Toolkit-Workspace/main/assets/fda-toolkit-banner.png)

<div style="text-align: center; margin: 20px 0;">
  <em>Clean. Validate. Analyze. Financial data made simple.</em>
</div>

[![PyPI version](https://img.shields.io/pypi/v/fda-toolkit)](https://pypi.org/project/fda-toolkit/)
[![PyPI Downloads](https://img.shields.io/pypi/dm/fda-toolkit)](https://pypi.org/project/fda-toolkit/)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

## Why FDA Toolkit?

Financial data analysis is messy. You spend **80% of your time** cleaning, validating, and transforming data instead of analyzing it. FDA Toolkit eliminates that pain by providing:

- **67 production-ready functions** grouped into 8 intelligent modules
- **One-line pipelines** for common workflows (e.g., `ftk.quick_clean_finance()`)
- **Finance-aware validation** — understand sign conventions, entity names, currency formats
- **Audit trail** — every operation logged for compliance and debugging
- **Type-safe** — full type hints and IDE autocomplete throughout
- **Memory efficient** — optimize dtypes, handle large files with chunking
- **Professional API** — pandas-like, intuitive, well-documented



## Module Overview

| Module | Functions | Purpose |
|--------|-----------|---------|
| **core** | 17 | Column cleaning, types, duplicates, missing, outliers, text |
| **features** | 7 | Date & categorical feature engineering |
| **finance** | 11 | Currency parsing, entity standardization, financial validation |
| **validation** | 9 | Schema, ranges, integrity, reconciliation |
| **reporting** | 10 | Profiling, snapshots, delta reports, quick checks |
| **io** | 5 | Safe CSV/Excel reading, chunked processing, parquet export |
| **pipelines** | 2 | Pre-built `quick_clean()` and `quick_clean_finance()` |
| **utils** | 6 | Logging, security, memory optimization |
| **TOTAL** | **67** | Production-ready functions |




## Quick Start

### Install

```bash
pip install fda-toolkit
```

### Update to Latest Version

**Using pip:**
```bash
pip install --upgrade fda-toolkit
```

**Using uv (faster):**
```bash
uv pip install --upgrade fda-toolkit
```

**In Jupyter Notebooks:**
```python
# Add this to a cell and run it
%pip install --upgrade fda-toolkit

# Or with uv
!uv pip install --upgrade fda-toolkit

# Then restart your kernel
```

**For Projects with requirements.txt:**
```bash
# Update the version in requirements.txt
fda-toolkit>=0.3.0

# Then reinstall
pip install -r requirements.txt --upgrade
# or with uv
uv pip install -r requirements.txt
```

### Check Version

```python
import fda_toolkit as ftk
print(ftk.__version__)  # Should show 0.3.0 or later
```

### Use in 3 Lines

```python
import fda_toolkit as ftk

df = ftk.read_csv_safely("data/transactions.csv")
df_clean = ftk.quick_clean_finance(df, primary_key="transaction_id", 
                                   date_cols=["date"], currency_cols=["amount"])
ftk.quick_check(df_clean)  # Profile results
```

### Discover All Functions

```python
# See what's available (67 functions with tooltips)
ftk.info()

# Filter to all core function groups
ftk.info(category='Core')

# Filter by category
ftk.info(category='Finance')

# Filter by module
ftk.info(module='finance.parsing')

# Combine filters
ftk.info(category='Finance', module='finance.parsing')
```

**Hover over function names** to see descriptions (in Jupyter notebooks).

---

## 📚 What's Inside?

### Core Data Cleaning (17 functions)
Handle the fundamentals with confidence:

```python
from fda_toolkit.core import columns, duplicates, missing, outliers, text, types

df = columns.clean_column_headers(df)           # 'Name ' → 'name'
df = types.clean_numeric_column(df['amount'])   # '$1,234.56' → 1234.56
df = missing.fill_missing(df, strategy='mean')  # Handle NaN intelligently
df = duplicates.remove_duplicates(df, subset=['id'])
df = outliers.flag_outliers(df, 'amount')       # Flag statistical outliers
```

### Finance-Specific (11 functions)
Domain expertise built-in:

```python
from fda_toolkit.finance import parsing, entities, rules

df['amount'] = parsing.parse_currency(df['amount'])        # Handle $, €, £
df['vendor'] = entities.strip_legal_suffixes(df['vendor']) # ACME Ltd → ACME
rules.validate_sign_conventions(df, rules_config)          # Verify debit/credit
```

### Feature Engineering (7 functions)
Prepare data for ML in seconds:

```python
from fda_toolkit.features import datetime, categorical

df = datetime.extract_date_features(df, 'date')  # Add year, month, quarter
df['category'] = categorical.limit_cardinality(df['category'], top_n=10)
```

### Validation Suite (9 functions)
Catch issues before they become problems:

```python
from fda_toolkit.validation import schema, ranges, integrity

schema.validate_required_fields(df, ['id', 'date', 'amount'])
violations = ranges.validate_data_ranges(df, {'amount': (0, 1_000_000)})
integrity.reconciliation_check(original_df, clean_df, value_cols=['amount'])
```

### Smart Pipelines (2 functions)
Pre-built, battle-tested workflows:

```python
# Generic pipeline
df_clean = ftk.quick_clean(df)

# Finance pipeline (smart defaults for financial data)
df_clean = ftk.quick_clean_finance(
    df,
    primary_key="invoice_id",
    date_cols=["invoice_date", "due_date"],
    currency_cols=["amount", "tax"]
)
```

### Reporting & Profiling (10 functions)
Understand your data instantly:

```python
# Quick diagnosis
ftk.quick_check(df)

# Detailed profile
profile = ftk.profile_report(df)  # Types, missingness, memory, outliers

# Track changes
snapshot_v1 = ftk.snapshot_dataset(df_before, name="before_clean")
snapshot_v2 = ftk.snapshot_dataset(df_after, name="after_clean")
delta = ftk.compare_snapshots(snapshot_v1, snapshot_v2)
```

### Secure I/O (5 functions)
Read and write without surprises:

```python
# Safe reading with encoding detection
df = ftk.read_csv_safely("messy_file.csv")
df = ftk.read_excel_safely("workbook.xlsx", sheet_name="Data")

# Process huge files in chunks
for chunk in ftk.chunked_processing("huge_file.csv", chunksize=50_000):
    process(chunk)

# Export in optimized formats
ftk.export_parquet(df, "output.parquet")  # Fast, compressed
```



## Architecture: Dynamic & Scalable

Every function **self-registers** via decorator — no manual `__all__` lists:

```python
from fda_toolkit.registry import register_function

@register_function(
    name="detect_fraud",
    category="Validation",
    module="custom.fraud"
)
def detect_fraud(df: pd.DataFrame) -> pd.DataFrame:
    """Your custom logic here."""
    result = df[df['amount'] > threshold]
    audit_log("detect_fraud", before=len(df), after=len(result))
    return result

# Automatically appears in ftk.info()!
```

---

## Audit Trail (Compliance Ready)

Every operation is logged automatically:

```python
from fda_toolkit.utils.logging import get_global_audit_log

log = get_global_audit_log()

for event in log.events:
    print(f"✓ {event.name} at {event.timestamp_utc}")

# Export for compliance teams
audit_json = log.to_dict()  # JSON-ready
```

---

## 💡 Real-World Example

```python
import fda_toolkit as ftk

# 1. Load and diagnose
df = ftk.read_csv_safely("sales_transactions_2024.csv")
ftk.quick_check(df)
# → Reports: types, missing %, duplicates, outliers, memory usage

# 2. Clean for analysis
df_clean = ftk.quick_clean_finance(
    df,
    primary_key="transaction_id",
    date_cols=["date", "due_date"],
    currency_cols=["amount", "tax"]
)

# 3. Validate
from fda_toolkit.validation import integrity
integrity.reconciliation_check(
    original=df, 
    cleaned=df_clean,
    value_cols=["amount"],
    group_cols=["vendor_id"]
)

# 4. Engineer features for ML
df_ml = ftk.extract_date_features(df_clean, "date")
df_ml = ftk.limit_cardinality(df_ml, "vendor", top_n=20)

# 5. Export and log
ftk.export_parquet(df_ml, "ready_for_ml.parquet")
print("✅ Pipeline complete with full audit trail!")
```

---


---

## Testing

```bash
# Run all tests
pytest

# Run specific module
pytest tests/test_core/

# Verbose output
pytest -v
```

Example test:
```python
import pandas as pd
from fda_toolkit.core.columns import clean_column_headers

def test_clean_headers():
    df = pd.DataFrame({'Name ': [1], 'Age (years)': [2]})
    result = clean_column_headers(df)
    assert result.columns.tolist() == ['name', 'age_years']
```

---

## Installation & Development

### From Source

```bash
# Clone or download
cd fda_toolkit_project

# Install in editable mode (dev)
pip install -e .

# With dev dependencies (if available)
pip install -e ".[dev]"
```

### Requirements

- Python 3.9+
- pandas (data manipulation)
- numpy (numerical operations)

---

## Security & Compliance

- **Audit logging** — Every operation tracked with timestamps
- **Data masking** — `mask_sensitive_fields()` for PII protection
- **Type safety** — Full type hints prevent common errors
- **Error handling** — Clear, actionable error messages
- **Memory optimization** — Control data footprint

---

## 📖 API Reference

Explore the full API:

```python
ftk.info()                           # List all functions
ftk.info(category="Finance")         # Filter by domain
ftk.get_data_summary(df)            # Profile a dataset
ftk.profile_report(df)              # Detailed analysis
```

For detailed docs on each function:
```python
from fda_toolkit.core.outliers import detect_outliers_iqr
help(detect_outliers_iqr)  # Full docstring with examples
```

See [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for common patterns.

---

## 🎯 Use Cases

✅ **Financial Reporting** — Prepare data for compliance audits  
✅ **ML Pipelines** — Clean & engineer features for models  
✅ **Data Migration** — Validate and transform during transfers  
✅ **Anomaly Detection** — Flag outliers in transactions  
✅ **Time Series Analysis** — Extract date features automatically  
✅ **Data Quality Monitoring** — Profile and compare snapshots  

---

## 🚀 Next Steps

1. **Explore functions**: `ftk.info()`
2. **Try examples**: See [examples/01_quick_check.py](examples/01_quick_check.py)
3. **Read docs**: [docs/function_reference.md](docs/function_reference.md)
4. **Run tests**: `pytest`
5. **Extend**: Add your own functions using `@register_function`

---

## 📝 License

MIT License — see LICENSE for details.

---

## 🤝 Contributing

Found a bug? Have an idea? Open an issue or PR!

---

**Built for financial analysts who value time, accuracy, and peace of mind.** 📊✨

*FDA Toolkit: Where data cleaning stops being painful and starts being productive.*
