import pandas as pd
import pickle
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import VarianceThreshold

class MarsYieldPredictor:
    def __init__(self, model_path="model.pkl", data_path="soil_data.csv"):
        """Initialize the model and preprocessing settings."""
        self.model_path = model_path
        self.data_path = data_path
        self.model = self.load_model()
        self.soil_data = pd.read_csv(self.data_path)
        
        # Units dictionary for soil variables
        self.units = {
            "lbsN": "lb N/ac (N rate)", "FN": "kg N/ha (N rate)",
            "lbsP2O5": "lb P2O5/ac (P rate)", "FP": "kg P/ha (P rate)",
            "lbsK20": "lb K2O/ac (K rate)", "FK": "kg K/ha (K rate)",
            "lbsS": "lb S/ac (S rate)", "FS": "kg S/ha (S rate)",
            "POP ha": "plants/ha (plant population)", "POP ac": "plants/acre (plant population)",
            "GY bu": "bu/acre (grain yield, 15.5% moisture)", "GY Mg": "Mg/ha (grain yield, 15.5% moisture)",
            "GDM": "kg/ha (grain dry matter, oven-dry)", "CDM": "kg/ha (cob dry matter, oven-dry)",
            "VDM": "kg/ha (stover dry matter, oven-dry)", "TDM": "kg/ha (total aboveground dry matter, oven-dry)",
            "EARS": "no./ha (number of ears)", "BARR": "% (barren stalks)", "PROL": "% (prolific plants)",
            "KERNE": "no/ear (kernels per ear)", "KERNm": "no./m2 (kernels per m2)", "HSW": "g (100-seed weight, oven-dry)",
            "gUN": "kg/ha (N uptake grain)", "cUN": "kg/ha (N uptake cobs)", "vUN": "kg/ha (N uptake stover)", "UN": "kg/ha (N uptake total)",
            "gUP": "kg/ha (P uptake grain)", "cUP": "kg/ha (P uptake cobs)", "vUP": "kg/ha (P uptake stover)", "UP": "kg/ha (P uptake total)",
            "gUK": "kg/ha (K uptake grain)", "cUK": "kg/ha (K uptake cobs)", "vUK": "kg/ha (K uptake stover)", "UK": "kg/ha (K uptake total)",
            "gUCa": "kg/ha (Ca uptake grain)", "cUCa": "kg/ha (Ca uptake cobs)", "vUCa": "kg/ha (Ca uptake stover)", "UCa": "kg/ha (Ca uptake total)",
            "gUMg": "kg/ha (Mg uptake grain)", "cUMg": "kg/ha (Mg uptake cobs)", "vUMg": "kg/ha (Mg uptake stover)", "UMg": "kg/ha (Mg uptake total)",
            "Bray-P 0-4": "mg P/kg soil (Bray-1 P, 0-4\" depth)", "Bray-P 4-8": "mg P/kg soil (Bray-1 P, 4-8\" depth)",
            "cumBray-P8": "kg P/ha (cumulative Bray-1 P in 0-8\")", "cumBray-P16": "kg P/ha (cumulative Bray-1 P in 0-16\")",
            "K 0-4": "mg K/kg soil (available K P, 0-4\" depth)", "K 4-8": "mg K/kg soil (available K P, 4-8\" depth)",
            "cumK8": "kg K/ha (cumulative available K P in 0-8\")", "cumK16": "kg K/ha (cumulative available K P in 0-16\")",
            "NO3-12S": "mg N/kg soil (spring soil nitrate, 0-12\")", "NO3-24S": "mg N/kg soil (spring soil nitrate, 12-24\")",
            "NO3-36S": "mg N/kg soil (spring soil nitrate, 24-36\")", "NO3-48S": "mg N/kg soil (spring soil nitrate, 36-48\")",
            "avgNO3-S2ft": "mg N/kg soil (average spring soil nitrate, 0-24\")", "avgNO3-S3ft": "mg N/kg soil (average spring soil nitrate, 0-36\")",
            "avgNO3-S4ft": "mg N/kg soil (average spring soil nitrate, 0-48\")", "cumNO3-S": "kg N/ha (cumulative spring soil nitrate, 0-48\")",
            "PSNT": "mg N/kg soil (Pre-sidedress nitrate test, 0-12\")", "SO4-S12": "mg S/kg soil (spring soil sulfate-S, 0-12\")",
            "SO4-S24": "mg S/kg soil (spring soil sulfate-S, 12-24\")", "SO4-S36": "mg S/kg soil (spring soil sulfate-S, 24-36\")",
            "Zn 0-4": "mg Zn/kg soil (available soil Zn, 0-4\")", "Zn 4-8": "mg Zn/kg soil (available soil Zn, 4-8\")",
            "Fe 0-4": "mg Fe/kg soil (available soil Fe, 0-4\")", "Mn 0-4": "mg Mn/kg soil (available soil Mn, 0-4\")",
            "Cu 0-4": "mg Cu/kg soil (available soil Cu, 0-4\")", "S 0-4": "mg S/kg soil (available soil S, 0-4\")",
            "BD 0-8": "g/cm3 (soil bulk density, 0-8\")", "irrigN": "kg N/ha (estimated N input from irrigation water)"
        }
        
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
    
    def get_user_inputs(self, base_soil):
        """Allow user to either use default values for all inputs or modify some values."""
        user_choice = input("\nWould you like to use default values for all inputs? (yes/no): ").strip().lower()
        
        if user_choice == "yes":
            return base_soil.to_dict(), base_soil.to_dict()
        
        user_inputs = {}
        default_used = {}

        print("\n🟠 **Enter Mars soil conditions** (Press ENTER to use default values)\n")

        for col in base_soil.index:
            unit = self.units.get(col, "")
            user_input = input(f"{col} {unit} ({base_soil[col]} default): ")
            if user_input.strip() == "":
                user_inputs[col] = base_soil[col]  # Use default value
                default_used[col] = base_soil[col]
            else:
                try:
                    user_inputs[col] = float(user_input)
                except ValueError:
                    print(f"❌ Invalid input for {col}. Using default.")
                    user_inputs[col] = base_soil[col]
                    default_used[col] = base_soil[col]

        return user_inputs, default_used
    
    def predict_yield(self, user_inputs):
        """Predict yield using the trained model after preprocessing input."""
        processed_input = self.preprocess_input(user_inputs)
        
        prediction = self.model.predict(processed_input)
        return max(0, int(round(prediction[0])))
    
    def run(self):
        """Run the Mars yield predictor interactively."""
        base_soil = self.get_mars_base_soil()
        if base_soil is None:
            print("⚠️ No base soil data found.")
            return

        user_inputs, default_used = self.get_user_inputs(base_soil)
        predicted_yield = self.predict_yield(user_inputs)
        
        print(f"\n🚀 **Predicted Yield on Mars:** {predicted_yield} Mg/ha\n")

        

# Run the Mars Predictor
if __name__ == "__main__":
    predictor = MarsYieldPredictor()
    predictor.run()
