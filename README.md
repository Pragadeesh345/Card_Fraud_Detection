# FraudGuard Pro — Credit Card Fraud Detection

FraudGuard Pro is a machine learning-based credit card fraud detection project that combines multiple classification models with a Flask web application. It generates synthetic transaction data, engineers features, trains ML models, and provides an interactive interface for evaluating transactions.

## Overview

The project explores how machine learning can distinguish potentially fraudulent transactions from normal transactions using transaction characteristics and engineered features.

**Key highlights**

* Synthetic transaction data generation
* Feature engineering and preprocessing
* Training and comparison of four machine learning models
* Fraud prediction through a Flask web application
* Interactive transaction scoring interface
* Saved model artifacts for inference

## Machine Learning Models

The project implements four classification algorithms:

| Model                        | Description                                       |
| ---------------------------- | ------------------------------------------------- |
| Support Vector Machine (SVM) | Classifies transactions using an RBF kernel       |
| Random Forest                | Uses an ensemble of decision trees                |
| Logistic Regression          | Provides a baseline classification approach       |
| Neural Network (MLP)         | Learns nonlinear patterns in transaction features |

The models are evaluated using accuracy and ROC-AUC metrics.

> **Note:** The project uses synthetic data. Performance results on synthetic transactions should not be interpreted as evidence of equivalent performance on real-world banking transactions.

## Dataset

The application generates a synthetic dataset for model training and evaluation rather than using real customer or banking records.

The default configuration generates **10,000 transactions**, with a fraud ratio of approximately **15%**.

### Features

The pipeline uses transaction and account characteristics, including:

* Transaction amount and time
* Merchant category
* Distance from home
* Previous fraud history
* Account age
* Transaction frequency
* Account balance and credit limit
* Card type and monthly income
* Amount-to-balance and amount-to-credit ratios
* Time-based and transaction-pattern indicators

Additional features include credit score, daily transaction count, average transaction amount, and time since the previous transaction.

## Technology Stack

* **Language:** Python
* **Machine Learning:** scikit-learn
* **Data Processing:** pandas, NumPy
* **Model Persistence:** Joblib
* **Backend:** Flask
* **Frontend:** HTML, CSS, JavaScript

See `requirements.txt` for the project's Python dependencies.

## Project Structure

```text
FraudGuard_Pro/
├── fraudguard_pro.py
├── ml_fraud_detector.py
├── requirements.txt
├── PROJECT_SUMMARY.md
├── start_fraudguard_pro.bat
├── fraud_models_svm.joblib
├── fraud_models_random_forest.joblib
├── fraud_models_logistic_regression.joblib
├── fraud_models_neural_network.joblib
├── fraud_models_scaler.joblib
├── templates/
│   └── fraudguard_index.html
└── static/
    ├── fraudguard_style.css
    └── fraudguard_script.js
```

## Getting Started

### Prerequisites

* Python 3.10 or later
* pip

### Installation

1. Clone the repository:

   ```bash
   git clone <your-repository-url>
   cd FraudGuard_Pro
   ```

2. Create a virtual environment:

   ```bash
   python -m venv .venv
   ```

3. Activate the environment.

   **Windows Command Prompt:**

   ```cmd
   .venv\Scripts\activate
   ```

4. Install the dependencies:

   ```bash
   pip install -r requirements.txt
   ```

### Run the application

Start the Flask application:

```bash
python fraudguard_pro.py
```

Open the following address in your browser:

```text
http://localhost:5003
```

The application provides an interface for submitting transaction details and viewing fraud predictions.

## Model Training

To generate synthetic data and train the models, run:

```bash
python ml_fraud_detector.py
```

The training pipeline performs preprocessing, feature engineering, stratified train/test splitting, class-imbalance handling, model training, and evaluation.

The trained models and scaler are saved as Joblib artifacts for subsequent predictions.

**Note:** Retraining may overwrite the existing saved model files.

## Application Endpoints

| Endpoint          | Method | Purpose                                          |
| ----------------- | ------ | ------------------------------------------------ |
| `/`               | GET    | Serves the web interface                         |
| `/predict`        | POST   | Processes a transaction and returns a prediction |
| `/compare_models` | GET    | Returns model comparison metrics                 |

## Limitations

* The dataset is synthetic and may not represent the complexity of real financial transactions.
* Results depend on the generated data, feature engineering, preprocessing, and model configuration.
* The project is intended for academic demonstration and learning, not production banking or financial decision-making.
* Evaluation on real, appropriately labeled transaction data would be required before making real-world performance claims.

## Future Improvements

* Evaluate the models on suitable real-world or publicly available labeled datasets.
* Improve feature consistency between training and inference.
* Tune classification thresholds for different fraud-detection requirements.
* Add more comprehensive model evaluation and testing.
* Improve monitoring and handling of prediction errors.

## Acknowledgements

Developed as a final-year academic project exploring machine learning techniques for credit card fraud detection.
