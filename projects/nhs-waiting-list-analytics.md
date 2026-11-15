# NHS Waiting List Analytics

This project grew from a need to understand why NHS waiting lists change and whether falling numbers always represent better access to treatment. I analysed NHS England's Referral to Treatment statistics using Python, SQL, MySQL and Databricks to examine waiting-list trends alongside new treatment pathways and completed treatments.

## The research question

> **Are changes in NHS waiting lists driven by improvements in treatment capacity, or by changes in the number of patients starting treatment pathways?**

**What I found:** The project's historical analysis shows that the waiting list contracted during the early COVID-19 period when new RTT pathways fell sharply, then expanded substantially as demand returned. The existing project summary reports approximately **4.4 million** patients waiting before COVID, **3.2 million** during the early pandemic and **7.5 million** in FY 2024/25. This pattern raises an important analytical distinction: a falling waiting list does not necessarily indicate that more patients are being treated. However, these comparisons alone do not prove that referral suppression was the dominant cause in every period.

**How I investigated it:** I used NHS England's published RTT files to analyse incomplete pathways, treatment activity and new RTT clock starts across reporting periods. Python scripts process the source Excel publications into standardised datasets; a MySQL dimensional model and Databricks SQL workflows support time-series and trust-level comparisons. The repository also contains DAX measures and specifications for a Power BI reporting model.

[Read the complete project methodology](PROJECT_DOCUMENTATION.md).

## Key findings

<table width="100%">
  <thead>
    <tr>
      <th align="left" width="37%">Indicator</th>
      <th align="right" width="21%">Pre-COVID FY 2019/20</th>
      <th align="right" width="21%">Early COVID Apr–Jun 2020</th>
      <th align="right" width="21%">FY 2024/25</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Patients waiting</td><td align="right">~4.4m</td><td align="right">~3.2m</td><td align="right"><strong>~7.5m</strong></td></tr>
    <tr><td>New RTT periods per month</td><td align="right">~1.3m</td><td align="right">~0.8m</td><td align="right">~1.4m</td></tr>
    <tr><td>Patients waiting over 52 weeks</td><td align="right">&lt;2,000</td><td align="right">~21,000</td><td align="right">~300,000+</td></tr>
    <tr><td>18-week breach rate</td><td align="right">~16%</td><td align="right">~40%</td><td align="right">~38%</td></tr>
  </tbody>
</table>

**Why it matters:** Waiting-list performance needs to be interpreted alongside both incoming pathways and completed treatments. Looking only at the waiting-list total can obscure changes in access and demand.

These approximate figures come from the project's existing analysis and have **not been independently recalculated for this README revision**. The columns compare different kinds of periods, so they should not be treated as like-for-like monthly averages without checking the underlying definitions. New RTT periods are *clock starts*, not exclusively GP referrals. See the [full project documentation](PROJECT_DOCUMENTATION.md) for assumptions, calculations and context.

## Power BI dashboard

**Dashboard publication pending.** The repository includes a [Power BI DAX and report specification](powerbi/measures.md), but no verified published dashboard link or report-page screenshots.

The designed reporting views cover national waiting-list trends, referral and treatment activity, long waits, regional performance and trust comparisons. Genuine report screenshots and a verified link will be added when available.

## Data architecture

![NHS Waiting List Analytics pipeline](screenshots/nhs_waiting_list_work_flow.png)

The project combines Python extraction and transformation with a MySQL reporting model and a parallel Databricks Delta Lake track. For schemas, staging, analytical views and implementation details, see [Project Documentation](PROJECT_DOCUMENTATION.md).

## Documentation and reproducibility

| Resource | What it contains |
| --- | --- |
| [Project Documentation](PROJECT_DOCUMENTATION.md) | NHS RTT context, research design, data preparation, methodology and findings |
| [Power BI Measures](powerbi/measures.md) | DAX and dashboard design |
| [Databricks Star Schema](databricks/06_star_schema_relationships.md) | Data model and relationships |
| [SQL Analytics](sql/analysis.sql) | Waiting-list and pathway analysis queries |
| [Python Pipeline](python/) | Extraction, processing and database loading scripts |
| [Exploratory Notebook](notebooks/01_referral_suppression_analysis.ipynb) | Exploratory analysis and supporting charts |

**Source:** [NHS England RTT Waiting Times Statistics](https://www.england.nhs.uk/statistics/statistical-work-areas/rtt-waiting-times/).

To reproduce the analysis, install the dependencies in `requirements.txt`, configure database credentials using `.env.example` and follow the repository's data preparation and SQL instructions. Some source and output files are large, and the complete environment has not been independently reproduced during this documentation review.

## Author

**Teslim Adeyanju** | [Portfolio](https://adeyanjuteslim.co.uk) | [LinkedIn](https://www.linkedin.com/in/adeyanjuteslimuthman)

[Previous detailed README](docs/readme-history.md)
