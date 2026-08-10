"""
Breast Cancer Wisconsin (Diagnostic) Dataset Fetcher
=====================================================
Run with your project's virtual environment:
    source venv/bin/activate
    python3 fetch_breast_cancer.py
"""

from ucimlrepo import fetch_ucirepo  # type: ignore[import-not-found]
import pandas as pd  # type: ignore[import-not-found]

def main():
    # Fetch dataset (ID 17 = Breast Cancer Wisconsin Diagnostic)
    print("Fetching Breast Cancer Wisconsin (Diagnostic) dataset from UCI ML Repo...")
    dataset = fetch_ucirepo(id=17)

    if dataset is None or dataset.data is None:
        raise RuntimeError("Failed to fetch dataset from UCI ML Repository. Check your internet connection.")

    # Data as pandas DataFrames
    X = dataset.data.features
    y = dataset.data.targets

    # Print summary info
    print(f"\nFeatures shape: {X.shape}")
    print(f"Targets shape:  {y.shape}")
    print(f"Feature columns: {list(X.columns)}")

    print("\n--- Features (first 5 rows) ---")
    print(X.head())

    print("\n--- Targets (first 5 rows) ---")
    print(y.head())

    # Save to CSV for later use in the project
    df = pd.concat([X, y], axis=1)
    output_file = "breast_cancer_dataset.csv"
    df.to_csv(output_file, index=False)
    print(f"\nDataset saved to {output_file} ({len(df)} rows)")

if __name__ == "__main__":
    main()
