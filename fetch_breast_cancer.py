from ucimlrepo import fetch_ucirepo 
import pandas as pd

# fetch dataset 
print("Fetching Breast Cancer Wisconsin (Diagnostic) dataset...")
breast_cancer_wisconsin_diagnostic = fetch_ucirepo(id=17) 
  
# data (as pandas dataframes) 
X = breast_cancer_wisconsin_diagnostic.data.features 
y = breast_cancer_wisconsin_diagnostic.data.targets 
  
# Print some info
print("\n--- Metadata ---")
print(breast_cancer_wisconsin_diagnostic.metadata) 
  
print("\n--- Variable Information ---")
print(breast_cancer_wisconsin_diagnostic.variables) 

print("\n--- Features (first 5 rows) ---")
print(X.head())

print("\n--- Targets (first 5 rows) ---")
print(y.head())

# Optionally, you can save it to a CSV for later use in your project
df = pd.concat([X, y], axis=1)
output_file = 'breast_cancer_dataset.csv'
df.to_csv(output_file, index=False)
print(f"\nDataset successfully saved to {output_file}")
