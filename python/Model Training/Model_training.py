import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import VarianceThreshold
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor  # Updated model
from sklearn.metrics import r2_score
import pickle

# Load soil data
soil_data = pd.read_csv("soil_data.csv")

# Define target variable
y = soil_data["GY Mg"]

# Filter for specific GY Mg value
filtered_rows = soil_data[soil_data['GY Mg'] == 3.66]
rows_as_dicts = filtered_rows.to_dict(orient='records')

# Drop unnecessary columns
soil_data = soil_data.drop(
    ['Year', 'Site-yr', 'Site-no', 'Site', 'Soil', 'prevCrop', 'Till', 
     'Texture', 'Treatment', 'Treat-no', 'GY Mg'], axis=1
)
soil_data = soil_data.replace("T", 0)

# Standardization and feature selection
scaler = StandardScaler()
variance_threshold = VarianceThreshold(threshold=0.01)
scaled_data = scaler.fit_transform(soil_data)
filtered_data = variance_threshold.fit_transform(scaled_data)

# Extract selected features
selected_features = soil_data.columns[variance_threshold.get_support()]
filtered_df = pd.DataFrame(filtered_data, columns=selected_features)
filtered_data_filled = filtered_df.fillna(filtered_df.mean())

# Correlation analysis
filtered_data_filled_for_corr = filtered_data_filled.copy()
filtered_data_filled_for_corr['GY Mg'] = y
corr_matrix = filtered_data_filled_for_corr.corr()

gy_corr = corr_matrix['GY Mg']
high_corr_columns = gy_corr[gy_corr.abs() > 0.6].index

# Save correlation matrix heatmap
filtered_corr_matrix = corr_matrix.loc[high_corr_columns, high_corr_columns]
plt.figure(figsize=(8, 6))
sns.heatmap(filtered_corr_matrix, annot=True, cmap='coolwarm', vmin=-1, vmax=1)
plt.title("Correlation Matrix")
plt.savefig("Correlation Matrix.png")

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    filtered_data_filled, y, test_size=0.3, random_state=42)

# Train Random Forest model
reg = RandomForestRegressor(n_estimators=100, random_state=42)
reg.fit(X_train, y_train)

# Evaluate model
pred = reg.predict(X_test)
r2 = r2_score(y_test, pred)
print(f"R² Score: {r2}")

# Save trained model
with open('model.pkl', 'wb') as f:
    pickle.dump(reg, f)
