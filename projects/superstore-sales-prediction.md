# Superstore Sales and Profit Classification

> A retail financial analytics and machine learning project that explores transaction profitability and trains a logistic regression classifier to distinguish profitable orders from loss making orders.

**Status:** Research and deployment prototype. Model performance and production readiness require additional validation.  
**Stack:** Python, pandas, NumPy, scikit-learn, Jupyter, Flask, Pipenv and Docker.

![Superstore Sales Prediction project workflow and illustrative model overview](a_clean_flat_infographic_style_diagram_on_a_whit%20%281%29.png)

> **Visual note:** The infographic illustrates the project workflow. Model performance figures and deployment claims shown in the image are historical or illustrative and are not independently verified. See the evaluation and limitations sections below.

## Executive Summary

Retail managers need to understand where transaction profit is generated and which orders carry a risk of loss. This project explores the Superstore transactions dataset and uses logistic regression to classify transactions according to whether their recorded profit is positive.

The repository contains an analysis notebook, a separate training script, a Flask prediction API, an example API client and a Dockerfile. The project should be treated as a learning and portfolio prototype rather than a deployed decision system. In particular, the current training features contain `profit_margin`, which may reveal the classification target if it is derived from the same transaction's realised profit.

## Business Problem and Objectives

The core question is: which measurable characteristics are associated with profitable and unprofitable retail transactions?

The project aims to examine sales, discounts and profitability by product category, customer segment and geography, construct a transaction level binary classification model, and make predictions accessible through a simple API.

**Scope clarification:** The implemented deployment model predicts a **profitability class**, not a future profit amount or time series sales forecast. It is not yet a validated tool for pricing decisions.

## Dataset and Target Definition

The source dataset is stored as `dataset.csv`. The current training script reads the transaction dataset, derives year and month from order and shipping dates, normalises categorical text, encodes product names, and defines the target:

```python
df["profit"] = (df["profit"] > 0).astype(int)
```

The target is 1 when recorded transaction profit is positive and 0 otherwise. The repository's original README reports 9,994 transactions, but dataset size and sample distribution should be confirmed in a reproducible data audit. Confirm the source licence and describe any data transformations before wider reuse.

## Workflow and Implementation

```text
Superstore transactions (dataset.csv)
          |
          v
Cleaning and date feature extraction
          |
          v
Binary target: realised profit > 0
          |
          v
Training and test split (80% / 20%)
          |
          v
DictVectorizer + logistic regression
          |
          v
Five fold ROC AUC evaluation
          |
          v
Final model and vectorizer (pickle)
          |
          v
Flask /predict endpoint
          |
          v
Profit probability and binary prediction
```

The deployment script `deployment_note/train.py` uses a shuffled five fold `KFold` on the training portion, computes ROC AUC on each fold and evaluates the final fitted model on a held out test portion. It serialises the fitted vectorizer and classifier to `model_C=1.0.bin`. The Flask service in `deployment_note/predict.py` returns `profit_probability` and a boolean `profit` outcome using a **0.50 threshold**.

The accompanying notebook `sales-forecasting-with-logistic-regression.ipynb` contains the exploratory workflow. Its reported conclusions should be reviewed against the actual data outputs before presenting them as verified business findings.

## Evaluation and Evidence Status

| Item | What the source code establishes | Assessment |
| --- | --- | --- |
| Prediction target | Positive versus nonpositive recorded transaction profit | Implemented |
| Model | Logistic regression with DictVectorizer | Implemented |
| Split | 80% training pool and 20% final test set | Implemented |
| Cross validation | Five shuffled folds evaluated using ROC AUC | Implemented |
| Reported 98.1% accuracy | Stated in historical README, not independently reproduced here | Unverified |
| Reported 99.9% ROC AUC | Stated in historical README, not independently reproduced here | Unverified |
| Production deployment | Flask, API client and Dockerfile are present | Not verified as operational |

### Critical model limitation: target leakage

The current model includes `profit_margin` among its inputs. If this field is calculated using the realised transaction profit, it leaks the information needed to determine the label. This may artificially inflate observed accuracy and ROC AUC.

Before publishing model scores, remove all inputs unavailable at prediction time or derived from the target, rerun training and report the new held out test results. Also evaluate class balance, precision, recall, F1, a confusion matrix, a majority class baseline and potential leakage from repeated orders or customers. Avoid claims that historical correlations establish causal profit drivers.

## Business Interpretation

Transaction level profitability analytics can help identify categories, regions and customer segments for further commercial investigation. However, this repository's original numerical segment margins, optimal discount thresholds and profit uplift projections have not been independently established by the present review. They should not be used as evidence of achieved financial impact.

The next analytical milestone is to produce an auditable table of segment, region, category and discount band performance directly from the source dataset.

## Technology and Repository Structure

```text
README.md
dataset.csv
sales-forecasting-with-logistic-regression.ipynb
deployment_note/
    train.py
    predict.py
    predict-test.py
    Pipfile
    Pipfile.lock
    Dockerfile
docs/
    legacy-readme.md
```

Python and pandas handle data preparation, scikit-learn implements vectorisation, training and ROC AUC evaluation, and Flask provides an HTTP API. Docker and Pipenv are included as deployment tooling, although their configuration still requires reconciliation.

## Reproduce the Project

Clone the repository and create a Python 3.10 environment compatible with `deployment_note/Pipfile`:

```bash
git clone https://github.com/TeslimAdeyanju/Superstore-Sales-Prediction.git
cd Superstore-Sales-Prediction
python3.10 -m venv .venv
source .venv/bin/activate
python -m pip install pipenv jupyter
cd deployment_note
pipenv install
```

**Current setup issue:** `train.py` reads `dataset.csv` from the current working directory, but that file is stored in the repository root. Before running the training script from `deployment_note/`, correct its dataset path or provide the dataset in the expected location. The existing Dockerfile also expects `model_C=1.0.bin` in the build context; create the model artifact first.

After resolving those paths, the intended training and API commands are:

```bash
python train.py
python predict.py
# From a separate terminal:
python predict-test.py
```

These commands describe the intended development workflow and have not been verified end to end in this documentation review. The Docker image currently uses Python 3.8 while Pipenv specifies Python 3.10, so container build success should not be assumed.

## Limitations and Next Steps

1. Remove potentially leaking financial inputs and revalidate the classifier.
2. Confirm model evaluation on truly unseen data and report reproducible metrics.
3. Repair dataset paths, dependency versions and Docker build prerequisites.
4. Check model input schema and ensure the sample API request matches training features.
5. Add tests for preprocessing, prediction, feature alignment and API errors.
6. Publish verified findings and actual notebook visualisations, with sources and definitions.
7. Evaluate a time based holdout if future transaction prediction is the intended use case.

## Project History

The complete earlier README, including historical performance, deployment and business impact statements, is preserved in [Historical README](docs/legacy-readme.md). Those claims are not independently validated by this revised overview.

## Author and Contact

**Teslim Adeyanju**  
[GitHub](https://github.com/TeslimAdeyanju) | [Portfolio](https://adeyanjuteslim.co.uk) | [LinkedIn](https://www.linkedin.com/in/adeyanjuteslimuthman)

This project is for education and portfolio demonstration. It should not be used as a production profitability decision tool without resolving the documented model and deployment issues.
