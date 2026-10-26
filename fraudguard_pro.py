#!/usr/bin/env python3
"""
FraudGuard Pro
Professional-grade credit card fraud detection system with advanced security analytics
"""

import random
import time
from flask import Flask, render_template, request, jsonify
from datetime import datetime
import json
from ml_fraud_detector import MLFraudDetectionSystem

app = Flask(__name__)

# FraudGuard Pro Detection Engine
class FraudGuardPro:
    def __init__(self):
        self.merchant_categories = {
            1: "🛒 Grocery Store",
            2: "⛽ Fuel Station", 
            3: "🍽️ Restaurant",
            4: "🛍️ Retail Store",
            5: "💻 Online Shopping",
            6: "🎬 Entertainment",
            7: "✈️ Travel",
            8: "🏥 Healthcare",
            9: "🎓 Education",
            10: "🏠 Real Estate"
        }
    
    def calculate_fraud_score(self, data):
        """Calculate fraud probability using advanced risk assessment algorithms"""
        fraud_score = 0
        
        # High amount transactions (₹50,000+)
        if data['amount'] > 50000:
            fraud_score += 0.3
        
        # Late night transactions (10 PM - 6 AM)
        if data['time'] < 6 or data['time'] > 22:
            fraud_score += 0.2
        
        # Geographic distance (100+ km from home)
        if data['distance_from_home'] > 100:
            fraud_score += 0.2
        
        # Previous fraud history
        if data['previous_fraud'] == 1:
            fraud_score += 0.4
        
        # New account (less than 30 days)
        if data['account_age_days'] < 30:
            fraud_score += 0.1
        
        # High transaction frequency
        if data['transaction_frequency'] > 10:
            fraud_score += 0.2
        
        # Low balance relative to transaction amount
        if data['amount'] > data['balance'] * 0.5:
            fraud_score += 0.2
        
        # Add realistic variance for accuracy
        fraud_score += random.uniform(-0.1, 0.1)
        
        # Clamp between 0 and 1
        return max(0, min(1, fraud_score))
    
    def classify_risk(self, fraud_score):
        """Classify risk level with professional security categories"""
        if fraud_score > 0.7:
            return 'HIGH'
        elif fraud_score > 0.3:
            return 'MEDIUM'
        else:
            return 'LOW'
    
    def is_fraud(self, fraud_score):
        """Determine if transaction is fraudulent"""
        return fraud_score > 0.5
    
    def get_recommendations(self, fraud_score, is_fraud):
        """Get professional security recommendations"""
        if is_fraud:
            return [
                "🚫 Block transaction immediately",
                "📞 Contact cardholder for verification",
                "🔍 Review recent transaction history",
                "🛡️ Enhance account security measures"
            ]
        elif fraud_score > 0.7:
            return [
                "⚠️ High risk detected - additional verification required",
                "🔐 Request multi-factor authentication",
                "👀 Monitor for similar transaction patterns",
                "🛡️ Implement enhanced security protocols"
            ]
        elif fraud_score > 0.3:
            return [
                "⚖️ Moderate risk - proceed with caution",
                "✅ Consider additional verification",
                "📊 Monitor for unusual patterns",
                "📝 Log for future review"
            ]
        else:
            return [
                "✅ Transaction appears legitimate",
                "🚀 Proceed with normal processing",
                "👁️ Continue routine monitoring",
                "😌 No immediate action required"
            ]

# Initialize FraudGuard Pro
fraud_guard = FraudGuardPro()

# Initialize ML Fraud Detection System
ml_system = MLFraudDetectionSystem()

# Load pre-trained models if they exist
try:
    ml_system.load_models()
    print("ML models loaded successfully")
except Exception as e:
    print(f"Could not load ML models: {e}")
    print("Training new models...")
    # Generate and train new models
    df = ml_system.generate_synthetic_dataset(n_samples=10000, fraud_ratio=0.15)
    X, y = ml_system.preprocess_data(df)
    ml_system.train_models(X, y)
    ml_system.save_models()
    print("New ML models trained and saved")

@app.route('/')
def index():
    """Serve the FraudGuard Pro interface"""
    return render_template('fraudguard_index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """Process fraud detection with advanced security analysis"""
    try:
        # Get form data
        data = {
            'amount': float(request.form.get('amount', 0)),
            'time': float(request.form.get('time', 12)),
            'merchant_category': int(request.form.get('merchant_category', 1)),
            'distance_from_home': float(request.form.get('distance_from_home', 0)),
            'previous_fraud': int(request.form.get('previous_fraud', 0)),
            'account_age_days': int(request.form.get('account_age_days', 365)),
            'transaction_frequency': int(request.form.get('transaction_frequency', 1)),
            'balance': float(request.form.get('balance', 100000)),
            'credit_limit': float(request.form.get('credit_limit', 200000)),
            'card_type': int(request.form.get('card_type', 1)),
            'transaction_date': request.form.get('transaction_date', ''),
            'monthly_income': float(request.form.get('monthly_income', 50000))
        }
        
        # Get selected ML model
        selected_model = request.form.get('ml_model', 'SVM')
        
        # Use ML system for prediction
        try:
            ml_result = ml_system.predict_fraud(data, selected_model)
            fraud_score = float(ml_result['fraud_probability'])  # Convert to Python float
            is_fraud = bool(ml_result['is_fraud'])  # Convert to Python bool
            model_used = ml_result['model_used']
        except Exception as ml_error:
            import traceback
            error_msg = str(ml_error)
            print(f"\n{'='*60}")
            print(f"ML prediction failed: {error_msg}")
            print(f"Full error traceback:")
            traceback.print_exc()
            print(f"{'='*60}\n")
            print("Falling back to rule-based system...")
            # Fallback to rule-based system
            fraud_score = fraud_guard.calculate_fraud_score(data)
            is_fraud = fraud_guard.is_fraud(fraud_score)
            model_used = "Rule-based (Fallback)"
        
        # Classify risk
        risk_level = fraud_guard.classify_risk(fraud_score)
        
        # Get recommendations
        recommendations = fraud_guard.get_recommendations(fraud_score, is_fraud)
        
        # Format amount in rupees
        amount_rupees = f"₹{data['amount']:,.2f}"
        
        # Get merchant category name
        merchant_name = fraud_guard.merchant_categories.get(data['merchant_category'], "Unknown")
        
        # Create professional response
        response = {
            'success': True,
            'fraud_probability': round(fraud_score * 100, 2),
            'risk_level': risk_level,
            'is_fraud': is_fraud,
            'recommendations': recommendations,
            'transaction_details': {
                'amount': amount_rupees,
                'merchant': merchant_name,
                'time': f"{data['time']:02.0f}:00",
                'distance': f"{data['distance_from_home']:.1f} km"
            },
            'security_message': get_security_message(fraud_score, risk_level),
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'ml_model_used': model_used,
            'model_confidence': 'High' if fraud_score > 0.8 or fraud_score < 0.2 else 'Medium'
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'security_message': "⚠️ Security analysis encountered an issue. Please verify your input and try again."
        })

def get_security_message(fraud_score, risk_level):
    """Generate professional security messages"""
    security_messages = {
        'LOW': [
            "✅ Transaction appears legitimate with standard security protocols",
            "🛡️ Low risk detected - proceeding with normal security measures",
            "🔒 Transaction cleared through standard fraud detection filters",
            "📊 Risk assessment indicates safe transaction processing"
        ],
        'MEDIUM': [
            "⚠️ Moderate risk detected - additional verification recommended",
            "🔍 Enhanced security review required for this transaction",
            "📋 Standard protocols suggest cautious processing approach",
            "🎯 Risk factors identified - proceed with enhanced monitoring"
        ],
        'HIGH': [
            "🚨 High risk transaction detected - immediate security action required",
            "🔴 Critical security alert - transaction flagged for review",
            "⚡ Urgent: Multiple risk factors identified - enhanced verification needed",
            "🛑 Security breach potential - immediate intervention recommended"
        ]
    }
    
    return random.choice(security_messages.get(risk_level, security_messages['LOW']))

@app.route('/compare_models', methods=['GET'])
def compare_models():
    """Compare performance of all ML models"""
    try:
        if not ml_system.is_trained:
            return jsonify({
                'success': False,
                'error': 'Models not trained yet'
            })
        
        # Get model performance data
        models_data = []
        best_model = None
        best_auc = 0
        
        for name, performance in ml_system.model_performance.items():
            models_data.append({
                'model': name,
                'accuracy': f"{performance['accuracy']:.4f}",
                'auc_score': f"{performance['auc_score']:.4f}"
            })
            
            if performance['auc_score'] > best_auc:
                best_auc = performance['auc_score']
                best_model = name
        
        return jsonify({
            'success': True,
            'models': models_data,
            'best_model': best_model
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

if __name__ == '__main__':
    print("Starting FraudGuard Pro...")
    print("Advanced security analytics and fraud detection")
    print("Open your browser and go to: http://localhost:5003")
    app.run(debug=True, host='0.0.0.0', port=5003)
