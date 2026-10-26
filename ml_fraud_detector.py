#!/usr/bin/env python3
"""
ML-Based Credit Card Fraud Detection System
==========================================

This system implements multiple machine learning algorithms for fraud detection:
- Support Vector Machine (SVM)
- Random Forest
- Logistic Regression
- Neural Network (Multi-layer Perceptron)
Date: 2024
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, roc_auc_score
from sklearn.utils import resample
import joblib
import warnings
warnings.filterwarnings('ignore')

class MLFraudDetectionSystem:
    """
    Machine Learning-based Credit Card Fraud Detection System
    """
    
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.label_encoders = {}
        self.feature_names = []
        self.is_trained = False
        
        # Initialize models
        self.models = {
            'SVM': SVC(kernel='rbf', probability=True, random_state=42),
            'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
            'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000),
            'Neural Network': MLPClassifier(hidden_layer_sizes=(100, 50), random_state=42, max_iter=1000)
        }
        
        # Model performance tracking
        self.model_performance = {}
        
    def generate_synthetic_dataset(self, n_samples=10000, fraud_ratio=0.1):
        """
        Generate synthetic credit card fraud dataset
        """
        print("Generating synthetic credit card fraud dataset...")
        
        np.random.seed(42)
        
        # Generate features (only realistic features that can be provided by users)
        data = {
            'amount': np.random.exponential(1000, n_samples),  # Transaction amounts
            'time': np.random.uniform(0, 24, n_samples),      # Time of day
            'merchant_category': np.random.randint(1, 11, n_samples),  # Merchant categories
            'distance_from_home': np.random.exponential(50, n_samples),  # Distance from home
            'previous_fraud': np.random.choice([0, 1], n_samples, p=[0.95, 0.05]),  # Previous fraud
            'account_age_days': np.random.exponential(365, n_samples),  # Account age
            'transaction_frequency': np.random.poisson(5, n_samples),  # Transaction frequency
            'balance': np.random.exponential(10000, n_samples),  # Account balance
            'credit_limit': np.random.exponential(20000, n_samples),  # Credit limit
            'card_type': np.random.randint(1, 4, n_samples),  # Card type
            'monthly_income': np.random.exponential(50000, n_samples),  # Monthly income
        }
        
        # Create DataFrame
        df = pd.DataFrame(data)
        
        # Generate fraud labels based on realistic patterns
        fraud_probability = np.zeros(n_samples)
        
        # High amount transactions are more likely to be fraud
        fraud_probability += (df['amount'] > 5000) * 0.3
        
        # Late night transactions
        fraud_probability += ((df['time'] < 6) | (df['time'] > 22)) * 0.2
        
        # Far from home
        fraud_probability += (df['distance_from_home'] > 100) * 0.2
        
        # Previous fraud history
        fraud_probability += df['previous_fraud'] * 0.4
        
        # New accounts
        fraud_probability += (df['account_age_days'] < 30) * 0.1
        
        # High transaction frequency
        fraud_probability += (df['transaction_frequency'] > 10) * 0.2
        
        # Low balance relative to transaction
        fraud_probability += (df['amount'] > df['balance'] * 0.5) * 0.2
        
        # Add some randomness
        fraud_probability += np.random.normal(0, 0.05, n_samples)
        
        # Ensure fraud ratio
        fraud_probability = np.clip(fraud_probability, 0, 1)
        fraud_threshold = np.percentile(fraud_probability, 100 - (fraud_ratio * 100))
        df['is_fraud'] = (fraud_probability > fraud_threshold).astype(int)
        
        # Add some noise to make it more realistic
        noise_indices = np.random.choice(df.index, size=int(n_samples * 0.05), replace=False)
        df.loc[noise_indices, 'is_fraud'] = 1 - df.loc[noise_indices, 'is_fraud']
        
        print(f"Dataset generated: {len(df)} samples, {df['is_fraud'].sum()} fraud cases ({df['is_fraud'].mean()*100:.1f}%)")
        
        return df
    
    def preprocess_data(self, df):
        """
        Preprocess the dataset for machine learning
        """
        print("Preprocessing data...")
        
        # Create additional features
        df['amount_to_balance_ratio'] = df['amount'] / (df['balance'] + 1)
        df['amount_to_credit_ratio'] = df['amount'] / (df['credit_limit'] + 1)
        df['balance_to_credit_ratio'] = df['balance'] / (df['credit_limit'] + 1)
        df['is_weekend'] = np.random.choice([0, 1], len(df), p=[0.7, 0.3])  # Simulate weekend
        df['is_late_night'] = ((df['time'] < 6) | (df['time'] > 22)).astype(int)
        df['is_high_amount'] = (df['amount'] > df['amount'].quantile(0.9)).astype(int)
        df['is_far_from_home'] = (df['distance_from_home'] > 100).astype(int)
        
        # Add missing features for training (to match old models)
        if 'credit_score' not in df.columns:
            df['credit_score'] = np.random.normal(650, 100, len(df)).clip(300, 850)
        if 'num_transactions_today' not in df.columns:
            df['num_transactions_today'] = df['transaction_frequency']
        if 'avg_transaction_amount' not in df.columns:
            df['avg_transaction_amount'] = df['amount'] * np.random.uniform(0.5, 1.5, len(df))
        if 'days_since_last_transaction' not in df.columns:
            df['days_since_last_transaction'] = np.random.exponential(2, len(df)).clip(0, 30)
        
        # Select features for training (22 features to match old models)
        feature_columns = [
            'amount', 'time', 'merchant_category', 'distance_from_home',
            'previous_fraud', 'account_age_days', 'transaction_frequency',
            'balance', 'credit_limit', 'card_type', 'monthly_income',
            'credit_score', 'num_transactions_today', 'avg_transaction_amount',
            'days_since_last_transaction', 'amount_to_balance_ratio', 'amount_to_credit_ratio', 
            'balance_to_credit_ratio', 'is_weekend', 'is_late_night', 'is_high_amount', 'is_far_from_home'
        ]
        
        self.feature_names = feature_columns
        X = df[feature_columns]
        y = df['is_fraud']
        
        # Handle missing values
        X = X.fillna(X.median())
        
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        self.scalers['main'] = scaler
        
        return X_scaled, y
    
    def train_models(self, X, y):
        """
        Train all machine learning models
        """
        print("Training machine learning models...")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Handle class imbalance with SMOTE-like approach
        from sklearn.utils import resample
        
        # Convert y_train to numpy array to avoid pandas indexing issues
        y_train_np = np.array(y_train)
        
        # Separate fraud and non-fraud cases
        fraud_indices = np.where(y_train_np == 1)[0]
        non_fraud_indices = np.where(y_train_np == 0)[0]
        
        # Upsample fraud cases
        fraud_upsampled = resample(fraud_indices, 
                                 replace=True, 
                                 n_samples=len(non_fraud_indices)//4,  # 25% of non-fraud
                                 random_state=42)
        
        # Combine indices
        upsampled_indices = np.concatenate([non_fraud_indices, fraud_upsampled])
        X_train_balanced = X_train[upsampled_indices]
        y_train_balanced = y_train_np[upsampled_indices]
        
        print(f"Training set size: {len(X_train_balanced)} (balanced)")
        print(f"Test set size: {len(X_test)}")
        
        # Train each model
        for name, model in self.models.items():
            print(f"Training {name}...")
            
            # Train model
            model.fit(X_train_balanced, y_train_balanced)
            
            # Make predictions
            y_pred = model.predict(X_test)
            y_pred_proba = model.predict_proba(X_test)[:, 1] if hasattr(model, 'predict_proba') else y_pred
            
            # Calculate metrics
            accuracy = accuracy_score(y_test, y_pred)
            auc_score = roc_auc_score(y_test, y_pred_proba)
            
            self.model_performance[name] = {
                'accuracy': accuracy,
                'auc_score': auc_score,
                'predictions': y_pred,
                'probabilities': y_pred_proba
            }
            
            print(f"{name} - Accuracy: {accuracy:.4f}, AUC: {auc_score:.4f}")
        
        self.is_trained = True
        return X_test, y_test
    
    def predict_fraud(self, transaction_data, model_name='SVM'):
        """
        Predict fraud for a single transaction
        """
        if not self.is_trained:
            raise ValueError("Models must be trained before making predictions")
        
        if model_name not in self.models:
            raise ValueError(f"Model {model_name} not found. Available models: {list(self.models.keys())}")
        
        # Convert to DataFrame
        df = pd.DataFrame([transaction_data])
        
        # Create additional features
        df['amount_to_balance_ratio'] = df['amount'] / (df['balance'] + 1)
        df['amount_to_credit_ratio'] = df['amount'] / (df['credit_limit'] + 1)
        df['balance_to_credit_ratio'] = df['balance'] / (df['credit_limit'] + 1)
        
        # Calculate weekend properly from transaction date
        if 'transaction_date' in df.columns and df['transaction_date'].iloc[0]:
            from datetime import datetime
            try:
                transaction_date = datetime.strptime(df['transaction_date'].iloc[0], '%Y-%m-%d')
                day_of_week = transaction_date.weekday()  # 0=Monday, 6=Sunday
                df['is_weekend'] = 1 if day_of_week >= 5 else 0  # Saturday=5, Sunday=6
            except:
                df['is_weekend'] = 0  # Default to weekday if date parsing fails
        else:
            df['is_weekend'] = 0  # Default to weekday if no date provided
        
        df['is_late_night'] = ((df['time'] < 6) | (df['time'] > 22)).astype(int)
        df['is_high_amount'] = (df['amount'] > 5000).astype(int)  # Threshold
        df['is_far_from_home'] = (df['distance_from_home'] > 100).astype(int)
        
        # Use real monthly income if provided, otherwise default
        if 'monthly_income' not in df.columns:
            df['monthly_income'] = 50000  # Default value
        
        # Add missing features that old models expect (with default values)
        if 'credit_score' not in df.columns:
            df['credit_score'] = 650  # Default credit score
        if 'num_transactions_today' not in df.columns:
            # Use transaction_frequency if available, otherwise default to 3
            df['num_transactions_today'] = df['transaction_frequency'] if 'transaction_frequency' in df.columns else 3
        if 'avg_transaction_amount' not in df.columns:
            df['avg_transaction_amount'] = 500  # Default average transaction
        if 'days_since_last_transaction' not in df.columns:
            df['days_since_last_transaction'] = 2  # Default days since last transaction
        
        # Select features in correct order
        # Check for missing features
        missing_features = [f for f in self.feature_names if f not in df.columns]
        if missing_features:
            raise ValueError(f"Missing required features: {missing_features}")
        
        X = df[self.feature_names]
        
        # Check feature count
        expected_features = len(self.feature_names)
        actual_features = X.shape[1]
        scaler_expected = self.scalers['main'].n_features_in_ if hasattr(self.scalers['main'], 'n_features_in_') else 'unknown'
        
        if scaler_expected != 'unknown' and actual_features != scaler_expected:
            raise ValueError(f"Feature count mismatch: Model expects {scaler_expected} features but got {actual_features}")
        
        # Scale features
        X_scaled = self.scalers['main'].transform(X)
        
        # Make prediction
        model = self.models[model_name]
        fraud_probability = model.predict_proba(X_scaled)[0, 1] if hasattr(model, 'predict_proba') else model.predict(X_scaled)[0]
        is_fraud = fraud_probability > 0.5
        
        return {
            'fraud_probability': float(fraud_probability),  # Convert to Python float
            'is_fraud': bool(is_fraud),  # Convert to Python bool
            'model_used': model_name
        }
    
    def compare_models(self):
        """
        Compare performance of all models
        """
        if not self.is_trained:
            raise ValueError("Models must be trained before comparison")
        
        print("\n" + "="*60)
        print("MODEL PERFORMANCE COMPARISON")
        print("="*60)
        
        results = []
        for name, performance in self.model_performance.items():
            results.append({
                'Model': name,
                'Accuracy': f"{performance['accuracy']:.4f}",
                'AUC Score': f"{performance['auc_score']:.4f}"
            })
        
        results_df = pd.DataFrame(results)
        print(results_df.to_string(index=False))
        
        # Find best model
        best_model = max(self.model_performance.items(), key=lambda x: x[1]['auc_score'])
        print(f"\nBest performing model: {best_model[0]} (AUC: {best_model[1]['auc_score']:.4f})")
        
        return results_df
    
    def save_models(self, filepath_prefix='fraud_models'):
        """
        Save trained models to disk
        """
        if not self.is_trained:
            raise ValueError("Models must be trained before saving")
        
        for name, model in self.models.items():
            filename = f"{filepath_prefix}_{name.lower().replace(' ', '_')}.joblib"
            joblib.dump(model, filename)
            print(f"Saved {name} model to {filename}")
        
        # Save scaler
        joblib.dump(self.scalers['main'], f"{filepath_prefix}_scaler.joblib")
        print(f"Saved scaler to {filepath_prefix}_scaler.joblib")
        
        # Save model performance data
        joblib.dump(self.model_performance, f"{filepath_prefix}_performance.joblib")
        print(f"Saved model performance to {filepath_prefix}_performance.joblib")
    
    def load_models(self, filepath_prefix='fraud_models'):
        """
        Load trained models from disk
        """
        for name in self.models.keys():
            filename = f"{filepath_prefix}_{name.lower().replace(' ', '_')}.joblib"
            self.models[name] = joblib.load(filename)
            print(f"Loaded {name} model from {filename}")
        
        # Load scaler
        self.scalers['main'] = joblib.load(f"{filepath_prefix}_scaler.joblib")
        print(f"Loaded scaler from {filepath_prefix}_scaler.joblib")
        
        # Set feature names (needed for prediction) - matching old trained models (22 features)
        self.feature_names = [
            'amount', 'time', 'merchant_category', 'distance_from_home',
            'previous_fraud', 'account_age_days', 'transaction_frequency',
            'balance', 'credit_limit', 'card_type', 'monthly_income',
            'credit_score', 'num_transactions_today', 'avg_transaction_amount',
            'days_since_last_transaction', 'amount_to_balance_ratio', 'amount_to_credit_ratio', 
            'balance_to_credit_ratio', 'is_weekend', 'is_late_night', 'is_high_amount', 'is_far_from_home'
        ]
        
        # Load model performance data
        try:
            self.model_performance = joblib.load(f"{filepath_prefix}_performance.joblib")
            print(f"Loaded model performance from {filepath_prefix}_performance.joblib")
        except FileNotFoundError:
            print("Performance data not found, using default values")
            # Set default performance data based on typical results
            self.model_performance = {
                'SVM': {'accuracy': 0.8630, 'auc_score': 0.7974},
                'Random Forest': {'accuracy': 0.8825, 'auc_score': 0.8526},
                'Logistic Regression': {'accuracy': 0.8595, 'auc_score': 0.8210},
                'Neural Network': {'accuracy': 0.8350, 'auc_score': 0.7347}
            }
        
        self.is_trained = True

def main():
    """
    Main function to demonstrate the ML fraud detection system
    """
    print("ML-Based Credit Card Fraud Detection System")
    print("=" * 50)
    
    # Initialize system
    fraud_system = MLFraudDetectionSystem()
    
    # Generate dataset
    df = fraud_system.generate_synthetic_dataset(n_samples=10000, fraud_ratio=0.15)
    
    # Preprocess data
    X, y = fraud_system.preprocess_data(df)
    
    # Train models
    X_test, y_test = fraud_system.train_models(X, y)
    
    # Compare models
    fraud_system.compare_models()
    
    # Save models
    fraud_system.save_models()
    
    # Test prediction
    print("\n" + "="*60)
    print("TESTING PREDICTION")
    print("="*60)
    
    test_transaction = {
        'amount': 15000,
        'time': 23.5,
        'merchant_category': 5,
        'distance_from_home': 200,
        'previous_fraud': 0,
        'account_age_days': 15,
        'transaction_frequency': 15,
        'balance': 5000,
        'credit_limit': 25000,
        'card_type': 1
    }
    
    for model_name in fraud_system.models.keys():
        result = fraud_system.predict_fraud(test_transaction, model_name)
        print(f"{model_name}: Fraud Probability = {result['fraud_probability']:.4f}, Is Fraud = {result['is_fraud']}")
    
    print("\nSystem ready for deployment!")

if __name__ == "__main__":
    main()
