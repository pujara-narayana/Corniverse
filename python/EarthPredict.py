import pandas as pd
import pickle
import numpy as np
import random
import io
import matplotlib.pyplot as plt
import base64
import os
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import VarianceThreshold

class YieldPredictor:
    def __init__(self, model_path="model.pkl", data_path="soil_data.csv"):
        """Initialize the model and load preprocessing settings."""
        self.model_path = model_path
        self.data_path = data_path
        self.model = self.load_model()
        self.soil_data = pd.read_csv(self.data_path)

        # Load StandardScaler & VarianceThreshold (Ensure Consistency)
        self.scaler = StandardScaler()
        self.variance_threshold = VarianceThreshold(threshold=0.01)
        self.prepare_scaler_and_feature_selector()

    def load_model(self):
        """Load the trained model from a pickle file."""
        try:
            with open(self.model_path, 'rb') as f:
                model = pickle.load(f)
            print("🌍 Model loaded successfully.")
            return model
        except FileNotFoundError:
            print("Error: Model file not found. Please train the model first.")
            return None

    def prepare_scaler_and_feature_selector(self):
        """Fit the scaler and variance threshold on the dataset."""
        self.processed_soil_data = self.soil_data.drop(
            ['Year', 'Site-yr', 'Site-no', 'Site', 'Soil', 'prevCrop', 'Till',
             'Texture', 'Treatment', 'Treat-no', 'GY Mg'], axis=1
        ).replace("T", 0)

        scaled_data = self.scaler.fit_transform(self.processed_soil_data)
        self.variance_threshold.fit(scaled_data)
        self.selected_features = self.processed_soil_data.columns[self.variance_threshold.get_support()]

    def preprocess_input(self, input_row):
        """Apply scaling and feature selection to the input row before prediction."""
        df = pd.DataFrame([input_row])
        df = df.reindex(columns=self.selected_features, fill_value=0)  # Ensure Feature Consistency
        scaled_input = self.scaler.transform(df)
        filtered_input = self.variance_threshold.transform(scaled_input)

        return pd.DataFrame(filtered_input, columns=self.selected_features)

    def get_filtered_row(self):
        """Retrieve the first row where 'GY Mg' == 13.66."""
        filtered_rows = self.soil_data[self.soil_data['GY Mg'] == 13.66]
        if not filtered_rows.empty:
            return filtered_rows.iloc[0].drop(
                ['Year', 'Site-yr', 'Site-no', 'Site', 'Soil', 'prevCrop',
                 'Till', 'Texture', 'Treatment', 'Treat-no', 'GY Mg']
            ).copy()  # Avoid modification warnings
        else:
            print("No matching row found.")
            return None

    def adjust_properties(self, row, year):
        """Adjust soil properties dynamically, including depletion and fertilization effects."""
        base_year = 2020  
        decades_passed = (year - base_year) // 10

        # Temperature changes
        temp_increase_per_decade = random.uniform(1.5, 3.5)
        if 'Normal H (F)' in row and 'Normal L (F)' in row:
            row.at['Normal H (F)'] += decades_passed * temp_increase_per_decade
            row.at['Normal L (F)'] += decades_passed * temp_increase_per_decade

        # Soil depletion over time
        for col in ['SOM 0-4', 'SOM 4-8', 'SOM 0-8', 'SOM 8-16']:
            if col in row:
                row.at[col] -= decades_passed * random.uniform(0.3, 0.6)

        # Fertilizer Application in Certain Years
        if year in [2035, 2045, 2055, 2065, 2075, 2085, 2095]:
            print(f"💡 Major Fertilizer Boost in Year {year}!")
            for col in ['NO3-12S', 'NO3-24S', 'Bray-P 0-4', 'K 0-4']:
                if col in row:
                    row.at[col] += random.uniform(2.0, 5.0)

        return row

    def predict_yield(self, year):
        """Predict yield for a given year (2001 - 2100)."""
        if not (2001 <= year <= 2100):
            raise ValueError("Please enter a valid year between 2001 and 2100.")

        filtered_row = self.get_filtered_row()
        if filtered_row is None:
            return None

        adjusted_row = self.adjust_properties(filtered_row, year)
        processed_input = self.preprocess_input(adjusted_row)

        # Extreme randomness for bigger variations
        random_factor = np.random.uniform(-5.0, 5.0)
        prediction = self.model.predict(processed_input) + random_factor
        
        return int(round(prediction[0]))

    def plot_yield_trends(self):
        """Plot yield predictions from 2001 to 2100."""
        years = list(range(2001, 2101))
        yields = [self.predict_yield(year) for year in years]

        plt.figure(figsize=(10, 5))
        plt.plot(years, yields, marker='o', linestyle='-', color='b', label="Predicted Yield")
        plt.axvline(x=2035, color='r', linestyle='--', label="Fertilizer Boosts")
        plt.axvline(x=2045, color='r', linestyle='--')
        plt.axvline(x=2055, color='r', linestyle='--')
        plt.axvline(x=2065, color='r', linestyle='--')
        plt.axvline(x=2075, color='r', linestyle='--')
        plt.axvline(x=2085, color='r', linestyle='--')
        plt.axvline(x=2095, color='r', linestyle='--')

        plt.xlabel("Year")
        plt.ylabel("Yield (Mg/ha)")
        plt.title("📈 Yield Predictions (2001 - 2100)")
        plt.legend()
        
        plt.savefig("plot 1.png")

    def plot_climate_trends(self):
        """Plot temperature and precipitation variations over time."""
        years = list(range(2001, 2101))
        temp_changes = [random.uniform(0, 3.5) * ((year - 2020) // 10) for year in years]
        precip_changes = [random.uniform(-3, 3) for _ in years]

        plt.figure(figsize=(10, 5))
        plt.plot(years, temp_changes, marker='s', linestyle='-', color='orange', label="Temperature Rise (°F)")
        plt.plot(years, precip_changes, marker='d', linestyle='-', color='blue', label="Precipitation Changes (inches)")

        plt.xlabel("Year")
        plt.ylabel("Change")
        plt.title("🌦️ Climate Trends Over Time")
        plt.legend()
        
        plt.savefig("plot 2.png")

# Example Usage
if __name__ == "__main__":
    predictor = YieldPredictor()
    
    # Get individual prediction
    year = int(input("Enter a year (2001 - 2100): "))
    try:
        predicted_yield = predictor.predict_yield(year)
        print(f"Predicted Yield: {predicted_yield}")
    except ValueError as e:
        print(e)

    # Show graphs
    predictor.plot_yield_trends()
    predictor.plot_climate_trends()
