# Financial Performance Analytics Model

> **Portfolio 5 — Power BI Financial Data Analysis**
> A comprehensive financial performance analytics model built with Microsoft Power BI, demonstrating star-schema data modelling, Power Query transformations, and a structured DAX measure library covering profitability, growth, efficiency, pricing, and risk analysis.

---

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Data Source](#data-source)
- [Data Model](#data-model)
  - [Star Schema](#star-schema)
  - [Tables](#tables)
  - [Relationships](#relationships)
- [DAX Measure Library](#dax-measure-library)
  - [Profitability](#profitability)
  - [Revenue and Growth Ratios](#revenue-and-growth-ratios)
  - [Efficiency and Productivity Ratios](#efficiency-and-productivity-ratios)
  - [Cost and Discount Ratios](#cost-and-discount-ratios)
  - [Pricing Ratios](#pricing-ratios)
  - [Volume and Mix Ratios](#volume-and-mix-ratios)
  - [Segment and Market Ratios](#segment-and-market-ratios)
  - [Risk and Variance Ratios](#risk-and-variance-ratios)
  - [Operational Ratios](#operational-ratios)
- [Power Query Transformations](#power-query-transformations)
- [Getting Started](#getting-started)
- [Technical Notes](#technical-notes)

---

## Overview

This project analyses financial transaction data across products, countries, customer segments, and discount bands. The semantic model is engineered to support multi-dimensional financial analysis — from top-level revenue and profit summaries down to per-unit, per-transaction, and per-day operational metrics.

**Key capabilities:**

- Profitability analysis by product, country, and customer segment
- Month-over-month (MoM) and year-over-year (YoY) sales growth tracking
- Discount impact and pricing realisation analysis
- Cost structure breakdown (COGS, manufacturing price, discount bands)
- Operational efficiency metrics (transactions/day, units/day, revenue/transaction)
- Volume and profit mix across dimensions

---

## Project Structure

```
Portfolio-5-FinancialDataAnalysis/
│
├── Financial Performance Analytics Model.pbip          # Power BI Project entry point
│
├── Financial Performance Analytics Model.SemanticModel/
│   └── definition/
│       ├── model.tmdl                                  # Model-level settings and query groups
│       ├── expressions.tmdl                            # Shared Power Query expressions (data source)
│       ├── relationships.tmdl                          # Table relationships
│       ├── database.tmdl
│       ├── cultures/                                   # Localisation
│       ├── tables/
│       │   ├── Transaction.tmdl                        # Fact table
│       │   ├── Date_dimension.tmdl                     # CALENDARAUTO date table
│       │   ├── Product_dimension.tmdl
│       │   ├── Country_dimension.tmdl
│       │   ├── Segement_dimension.tmdl
│       │   ├── Discount_dimension.tmdl
│       │   └── DAX.tmdl                                # All DAX measures
│       └── diagramLayout.json
│
├── Financial Performance Analytics Model.Report/
│   └── definition/
│       ├── report.json
│       └── pages/
│           └── 782e5417901907f84aaa/
│               └── page.json                           # Report page definition
│
├── Financial Sample.xlsx                               # Source data
└── Financial Data Modelling.pbix                       # Legacy .pbix file
```

The project uses the modern **Power BI Project (.pbip)** format with **TMDL (Tabular Model Definition Language)** — enabling version control of every model artefact as plain text files.

---

## Data Source

| Property | Value |
|---|---|
| File | `Financial Sample.xlsx` |
| Table | `financials` |
| Format | Excel Workbook |
| Load mode | Import |

The source contains raw transactional data with the following columns:

| Column | Type | Description |
|---|---|---|
| Segment | Text | Customer segment (e.g. Government, Enterprise) |
| Country | Text | Sales country |
| Product | Text | Product name |
| Discount Band | Text | Discount tier applied |
| Units Sold | Number | Quantity sold |
| Manufacturing Price | Integer | Cost to manufacture per unit |
| Sale Price | Integer | Listed sale price per unit |
| Gross Sales | Number | Units Sold × Sale Price |
| Discounts | Number | Discount amount applied |
| Sales | Number | Net sales after discounts |
| COGS | Number | Cost of Goods Sold |
| Profit | Number | Net profit |
| Date | Date | Transaction date |
| Month Number | Integer | Month number |
| Month Name | Text | Month name |
| Year | Integer | Year |

---

## Data Model

### Star Schema

![Star schema model](image/star%20schema.png)

### Tables

#### Fact Table

**`Transaction`** — Central fact table loaded from the `financials` Excel source. Foreign keys are resolved via Power Query left-outer joins against each dimension table.

| Column | Type | Folder |
|---|---|---|
| Units Sold | Double | Sales Information |
| Manufacturing Price | Integer | Cost Information |
| Sale Price | Integer | Sales Information |
| Gross Sales | Double | Sales Information |
| Discounts | Double | Cost Information |
| COGS | Double | Cost Information |
| Sales | Double | — |
| Profit | Double | Sales Information |
| Date | Date | Foreign Key |
| Segment key | Integer | Foreign Key |
| Country Key | Integer | Foreign Key |
| Product key | Integer | Foreign Key |
| Discount Brand Key | Integer | Foreign Key |
| Discount Band | Text | — |
| Month Number | Integer | — |
| Month Name | Text | — |
| Year | Integer | — |

#### Dimension Tables

| Table | Key Column | Derived From | Method |
|---|---|---|---|
| `Segement_dimension` | Segment key | financials.Segment | Distinct values + auto-index |
| `Country_dimension` | Country Key | financials.Country | Distinct values + auto-index |
| `Product_dimension` | Product key | financials.Product | Distinct values + auto-index |
| `Discount_dimension` | Discount Brand Key | financials.Discount Band | Distinct values + auto-index |
| `Date_dimension` | Date | CALENDARAUTO() | Calculated DAX table |

`Date_dimension` is a fully calculated date table generated automatically from the data range, with derived columns for Year, Month Number, Month Name, Day of Week, and Day Name.

#### Measure Container

**`DAX`** — An empty placeholder table used exclusively to host all DAX measures, keeping them separate from the fact and dimension tables. This is a widely adopted best practice for model organisation.

### Relationships

All relationships are many-to-one from `Transaction` (many side) to the respective dimension (one side):

| From | To |
|---|---|
| Transaction.'Segment key' | Segement_dimension.'Segment key' |
| Transaction.'Country Key' | Country_dimension.'Country Key' |
| Transaction.'Product key' | Product_dimension.'Product key' |
| Transaction.'Discount Brand Key' | Discount_dimension.'Discount Brand Key' |
| Transaction.Date | Date_dimension.Date |

---

## DAX Measure Library

All measures are stored in the `DAX` table, organised into display folders. All monetary values are formatted in **GBP (£)**.

### Profitability

| Measure | Formula Summary |
|---|---|
| `Total Sales` | `SUM(Transaction[Sales])` |
| `Total Profit` | `SUM(Transaction[Profit])` |
| `Total COGS` | `SUM(Transaction[COGS])` |
| `Total Gross Sales` | `SUM(Transaction[Gross Sales])` |
| `Total Discounts` | `SUM(Transaction[Discounts])` |
| `Total Units Sold` | `SUM(Transaction[Units Sold])` |
| `Transaction Count` | `COUNTROWS(Transaction)` |
| `Profit Margin` | `Total Profit ÷ Total Sales` |
| `Gross Profit Margin %` | `(Gross Sales − COGS) ÷ Gross Sales` |
| `Net Profit Margin %` | `Total Profit ÷ Total Sales` |
| `Cost Ratio %` | `Total COGS ÷ Total Sales` |
| `Discount Rate %` | `Total Discounts ÷ Total Gross Sales` |
| `Markup %` | `Total Profit ÷ Total COGS` |
| `Return on Cost %` | `Total Profit ÷ Total COGS` |
| `Profit per Unit` | `Total Profit ÷ Total Units Sold` |
| `Average Profit per Transaction` | `AVERAGEX(Transaction, Profit)` |
| `Average Sale Price per Unit` | `Total Sales ÷ Total Units Sold` |
| `Average Cost per Unit` | `Total COGS ÷ Total Units Sold` |

### Revenue and Growth Ratios

| Measure | Formula Summary |
|---|---|
| `Previous Month Sales` | `CALCULATE(Total Sales, DATEADD(Date, -1, MONTH))` |
| `Previous Year Sales` | `CALCULATE(Total Sales, SAMEPERIODLASTYEAR(Date))` |
| `MoM Sales Growth %` | `(Current Sales − Prior Month Sales) ÷ Prior Month Sales` |
| `YoY Sales Growth %` | `(Current Sales − Prior Year Sales) ÷ Prior Year Sales` |
| `Sales Growth Value YoY` | `Current Sales − Prior Year Sales` |

### Efficiency and Productivity Ratios

| Measure | Formula Summary |
|---|---|
| `Revenue per Transaction` | `Total Sales ÷ Transaction Count` |
| `Units per Transaction` | `Total Units Sold ÷ Transaction Count` |
| `Profit per Transaction` | `Total Profit ÷ Transaction Count` |

### Cost and Discount Ratios

| Measure | Formula Summary |
|---|---|
| `Discount to Sales %` | `Total Discounts ÷ Total Sales` |
| `Discount per Transaction` | `Total Discounts ÷ Transaction Count` |
| `Discount per Unit` | `Total Discounts ÷ Total Units Sold` |
| `Cost Recovery %` | `Total Sales ÷ Total COGS` (formatted as multiplier) |

### Pricing Ratios

| Measure | Formula Summary |
|---|---|
| `Average Gross Sales per Unit` | `Total Gross Sales ÷ Total Units Sold` |
| `Average Realised Price per Unit` | `Total Sales ÷ Total Units Sold` |
| `Price Realisation %` | `Total Sales ÷ Total Gross Sales` |
| `Discount Impact %` | `(Gross Sales − Sales) ÷ Gross Sales` |

### Volume and Mix Ratios

| Measure | Formula Summary |
|---|---|
| `Product Sales Mix %` | `Sales ÷ ALL(Product_dimension) Sales` |
| `Product Volume Mix %` | `Units ÷ ALL(Product_dimension) Units` |
| `Product Profit Mix %` | `Profit ÷ ALL(Product_dimension) Profit` |

### Segment and Market Ratios

| Measure | Formula Summary |
|---|---|
| `Segment Sales Share %` | `Sales ÷ ALL(Segement_dimension) Sales` |
| `Segment Profit Share %` | `Profit ÷ ALL(Segement_dimension) Profit` |
| `Country Sales Share %` | `Sales ÷ ALL(Country_dimension) Sales` |
| `Country Profit Share %` | `Profit ÷ ALL(Country_dimension) Profit` |

### Risk and Variance Ratios

| Measure | Formula Summary |
|---|---|
| `Sales Variance % vs Previous Month` | `MoM sales percentage change` |
| `Profit Variance % vs Previous Month` | `MoM profit percentage change` |
| `Profit Margin Variance %` | `Current Net Margin % − Prior Month Net Margin %` |

### Operational Ratios

| Measure | Formula Summary |
|---|---|
| `Transactions per Day` | `Transaction Count ÷ DISTINCTCOUNT(Date)` |
| `Units Sold per Day` | `Total Units Sold ÷ DISTINCTCOUNT(Date)` |
| `Sales per Day` | `Total Sales ÷ DISTINCTCOUNT(Date)` |
| `Profit per Day` | `Total Profit ÷ DISTINCTCOUNT(Date)` |

---

## Power Query Transformations

All dimension tables are derived dynamically from the source `financials` table using a consistent Power Query pattern:

1. **Select** the relevant attribute column
2. **Deduplicate** rows to get distinct values
3. **Add an auto-index** starting at 1 as a surrogate key
4. **Rename** the index to the key column name

The `Transaction` fact table is built by:

1. Loading the raw `financials` table
2. Performing **left-outer joins** against each dimension table to resolve surrogate keys
3. **Removing** the original text columns (Segment, Country, Product) after key substitution, preserving only foreign key integers

This pattern ensures dimension keys are consistent and referential integrity is maintained throughout the model.

---

## Getting Started

### Prerequisites

- **Power BI Desktop** (latest version recommended) with `.pbip` format support enabled
- The source file `Financial Sample.xlsx` must be present at the configured local path, or you will need to update the data source path in Power BI Desktop

### Opening the Report

1. Clone or download this repository
2. Open `Financial Performance Analytics Model.pbip` in Power BI Desktop
3. If prompted, update the Excel file path under **Transform Data > Data Source Settings**
4. Click **Refresh** to load the latest data

### Updating the Data Source Path

The Excel source path is defined in:

```
Financial Performance Analytics Model.SemanticModel/definition/expressions.tmdl
```

Update the `File.Contents(...)` path to match your local environment if needed.

---

## Technical Notes

- **Format:** Power BI Project (`.pbip`) with TMDL semantic model — all model artefacts are version-controllable plain text
- **Currency:** All monetary measures formatted in GBP (£)
- **Date table:** `Date_dimension` uses `CALENDARAUTO()` — it automatically spans the full date range present in the model
- **Measure isolation:** All DAX measures are housed in a dedicated empty `DAX` table following the measure-isolation pattern, keeping the fact table clean
- **Tooling:** Built using MCP-PBIModeling, TMDL View (Desktop), and Dev Mode

---

*Part of a Microsoft Power BI portfolio collection showcasing data modelling, DAX, and financial analytics.*
