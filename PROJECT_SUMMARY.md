## FraudGuard Pro – Project Summary

### Overview
FraudGuard Pro is a credit-card fraud detection project combining a trained ML ensemble with a small Flask web app for interactive scoring. It generates a realistic synthetic dataset, engineers features, trains multiple models, serves predictions via an HTTP endpoint, and includes a simple UI.

### Key Components
- `ml_fraud_detector.py`: End-to-end ML pipeline (data generation, preprocessing, training, evaluation, saving/loading models, prediction).
- `fraudguard_pro.py`: Flask app that loads the ML system and exposes endpoints/UI.
- `templates/fraudguard_index.html` + `static/*`: Minimal web interface and assets.
- `fraud_models_*.joblib`: Saved models and a shared `StandardScaler` artifact.
- `requirements.txt`: Python dependencies.
- `start_fraudguard_pro.bat`: Convenience launcher on Windows.

### Data & Features
- Synthetic dataset: 10,000 transactions (default), fraud ratio ≈ 15% with realistic fraud patterns (high amount, late night, far from home, previous fraud, new account, high frequency, amount vs balance), plus noise.
- Features (22 total): core inputs (amount, time, merchant_category, distance_from_home, previous_fraud, account_age_days, transaction_frequency, balance, credit_limit, card_type, monthly_income) and engineered signals:
  - Ratios: amount_to_balance_ratio, amount_to_credit_ratio, balance_to_credit_ratio
  - Flags: is_weekend, is_late_night, is_high_amount, is_far_from_home
  - Additional fields for consistency: credit_score, num_transactions_today, avg_transaction_amount, days_since_last_transaction

### Training Pipeline (in `ml_fraud_detector.py`)
1. Generate synthetic dataset: `generate_synthetic_dataset(n_samples=10000, fraud_ratio=0.15)`.
2. Preprocess: create engineered features, fill missing with medians, standardize with a shared `StandardScaler`.
3. Split: stratified 80/20 train/test.
4. Class imbalance handling: upsample fraud in training to ~25% of non-fraud count (test untouched).
5. Train models: SVM (RBF), Random Forest (100 trees), Logistic Regression, MLP (100,50).
6. Evaluate on test set: Accuracy and ROC AUC; store metrics.
7. Persist artifacts: save each model and the scaler via `joblib`.

### Inference Flow
1. Receive transaction input (from UI or API).
2. Recreate engineered features consistently, including weekend calculation from `transaction_date` when available.
3. Transform with saved `StandardScaler`.
4. Predict probability with chosen model; default threshold 0.5 to classify fraud.

### Web Application (`fraudguard_pro.py`)
- Starts Flask on port 5003.
- Endpoints:
  - `/` – serves the UI (`fraudguard_index.html`).
  - `/predict` – POST; runs ML prediction; falls back to a rule-based score if ML errors.
  - `/compare_models` – GET; returns Accuracy/AUC for each trained model.
- On startup: attempts to load saved models; if missing, trains and saves new ones automatically.

### How to Run
1. Create/activate a Python 3.10+ environment.
2. Install deps: `pip install -r requirements.txt`.
3. Start app: `python fraudguard_pro.py` (or double-click `start_fraudguard_pro.bat`).
4. Open `http://localhost:5003` in a browser.

### How to Retrain Models
Run: `python ml_fraud_detector.py` – regenerates data, retrains, evaluates, and overwrites `fraud_models_*.joblib` and `fraud_models_scaler.joblib`.

### Files You Need to Keep
- Code: `ml_fraud_detector.py`, `fraudguard_pro.py`, `templates/`, `static/`.
- Artifacts: `fraud_models_*.joblib`, `fraud_models_scaler.joblib`.
- Ops: `requirements.txt`, `start_fraudguard_pro.bat`.

### Notes & Limitations
- Synthetic data accelerates development but may not capture all real-world behaviors; retrain with real labeled data when available.
- Threshold (0.5) can be tuned based on business costs; consider probability calibration for production.



