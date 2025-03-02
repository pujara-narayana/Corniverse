import pandas as pd
import pickle
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import VarianceThreshold
import matplotlib.pyplot as plt
import json

class MarsYieldPredictor:
    def __init__(self, model_path="model.pkl", data_path="soil_data.csv"):
        """Initialize the model and preprocessing settings."""
        self.model_path = model_path
        self.data_path = data_path
        self.model = self.load_model()
        self.soil_data = pd.read_csv(self.data_path)

        # Load StandardScaler & VarianceThreshold
        self.scaler = StandardScaler()
        self.variance_threshold = VarianceThreshold(threshold=0.01)
        self.prepare_scaler_and_feature_selector()

    def load_model(self):
        """Load the trained model from a pickle file."""
        try:
            with open(self.model_path, 'rb') as f:
                model = pickle.load(f)
            print("🔴 Mars Model loaded successfully.")
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
        df = df.reindex(columns=self.selected_features, fill_value=0)
        scaled_input = self.scaler.transform(df)
        filtered_input = self.variance_threshold.transform(scaled_input)
        return pd.DataFrame(filtered_input, columns=self.selected_features)

    def get_mars_base_soil(self):
        """Retrieve the Mars starting soil based on the lowest Earth yield."""
        filtered_rows = self.soil_data[self.soil_data['GY Mg'] == 3.66]
        if not filtered_rows.empty:
            return filtered_rows.iloc[0].drop(
                ['Year', 'Site-yr', 'Site-no', 'Site', 'Soil', 'prevCrop',
                 'Till', 'Texture', 'Treatment', 'Treat-no', 'GY Mg']
            ).copy()
        else:
            print("No base soil data found.")
            return None

    def adjust_for_tech_advancement(self, base_yield, year):
        """
        Simulate technological improvements in Martian farming.
        Yield gradually increases over time.
        """
        base_year = 2030  # Assuming first farming trials start in 2030
        years_passed = max(0, year - base_year)
        growth_factor = 1 + (0.02 * years_passed)  # 2% yield increase per year

        return int(round(base_yield * growth_factor))

    def predict_yield(self, user_inputs, year=2030):
        """Predict yield using the trained model after preprocessing input."""
        processed_input = self.preprocess_input(user_inputs)
        predicted_yield = self.model.predict(processed_input)[0]

        # Adjust for technological progress on Mars
        return self.adjust_for_tech_advancement(predicted_yield, year)

    def predict_yield_yes(self, year=2030):
        """Predict yield assuming all default values, adjusting for technological growth."""
        base_soil = self.get_mars_base_soil()
        if base_soil is None:
            print("⚠️ No base soil data found.")
            return None

        user_inputs = base_soil.to_dict()
        return self.predict_yield(user_inputs, year)

    def predict_yeild_json(self):
        """Predict yield for Mars from 2001 to 2100 and save to a JSON file."""
        years = list(range(2000, 2101, 10))  # Generate every decade
        yields = [self.predict_yield_yes(year) for year in years]  # Fix function call

        yield_data = [{"year": y, "yield": yld} for y, yld in zip(years, yields)]
        
        with open("mars_yield_predictions.json", "w") as json_file:
            json.dump(yield_data, json_file, indent=4)

    print("✅ Mars yield predictions saved to `mars_yield_predictions.json`")

    def run(self):
        """Run the Mars yield predictor interactively."""
        base_soil = self.get_mars_base_soil()
        if base_soil is None:
            print("⚠️ No base soil data found.")
            return

        year = int(input("Enter the year for prediction (2030 - 2100): ").strip())

        if year < 2030 or year > 2100:
            print("❌ Invalid year. Please enter a year between 2030 and 2100.")
            return

        predicted_yield = self.predict_yield_yes(year)
        self.predict_yeild_json()
        print(f"\n🚀 **Predicted Yield on Mars in {year}:** {predicted_yield} Mg/ha\n")
        return predicted_yield

    def plot_yield_trends(self):
        """Plot yield predictions from 2030 to 2100."""
        years = list(range(2030, 2101))
        yields = [self.predict_yield_yes(year) for year in years]

        plt.figure(figsize=(12, 6))
        plt.plot(years, yields, marker='o', color='b', linestyle='-', linewidth=2)
        plt.title("Mars Crop Yield Predictions (2030 - 2100)")
        plt.xlabel("Year")
        plt.ylabel("Predicted Yield (Mg/ha)")
        plt.grid(True)
        plt.savefig("mars_yield_predictions.png")
# Run the Mars Predictor
if __name__ == "__main__":
    predictor = MarsYieldPredictor()
    predictor.run()
