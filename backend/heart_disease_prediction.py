# # Generated from: heart_disease_prediction.ipynb
# # Converted at: 2026-02-08T10:09:39.278Z
# # Next step (optional): refactor into modules & generate tests with RunCell
# # Quick start: pip install runcell

# import numpy as np #importing the numpy module which will be used in this project
# import pandas as pd#importing the pandas module which will be used in this project
# import matplotlib.pyplot as plt#importing the matplotlib module which will be used in this project
# import seaborn as sns#importing the seaborn module which will be used in this project
# from sklearn.model_selection import train_test_split#importing the sklearn module which will be used in this project

# dataframe = pd.read_csv('dataset.csv')#reading our dataset using read_csv function
# dataframe.head() #printing the first 5 columns of our dataset using head function

# dataframe.drop('education', axis=1, inplace=True)#dropping unnecessary column education becuase this column won't impact the chances of a person having a heart attack

# dataframe.rename(columns={"TenYearCHD": "CHD"}, inplace=True) #changing the column name of TenYearCHD

# dataframe.head()#printing the dataset again using head funciton

# x = dataframe.iloc[:,:-1]
# y = dataframe.iloc[:,-1]
# X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.20)

# train_data = pd.concat([X_train, y_train], axis=1)
# test_data = pd.concat([X_test, y_test], axis=1)

# sns.countplot(x=train_data['male']) ##plotting a count plot of male using sns.countplot

# sns.countplot(x=train_data['male'], hue=train_data['CHD']) ##plotting a count plot of CHD and male having disease or not using sns.countplot

# plt.figure(figsize=(15,15))#plotting a figure of size 15 and 15
# sns.heatmap(train_data.corr(), annot=True, linewidths=0.1) #plotting a heatmat of dataframe correlation

# train_data.drop(['currentSmoker', 'diaBP'], axis=1, inplace=True)#dropping the column becuase they are correlated very high

# train_data = train_data[~(train_data['sysBP'] > 220)] #deleting the outliers values in sysBP of training data
# train_data = train_data[~(train_data['BMI'] > 43)]#deleting the outliers values in BMI of training data
# train_data = train_data[~(train_data['heartRate'] > 125)]#deleting the outliers values in heartRate of training data
# train_data = train_data[~(train_data['glucose'] > 200)]#deleting the outliers values in glucose of training data
# train_data = train_data[~(train_data['totChol'] > 450)]#deleting the outliers values in totChol of training data

# from sklearn.preprocessing import StandardScaler #importing the standard scaler library
# from sklearn.impute import SimpleImputer #importing the simple imputer library
# from sklearn.metrics import accuracy_score #importing the accuracy score function

# cols_to_standardise = ['age','totChol','sysBP','BMI', 'heartRate', 'glucose', 'cigsPerDay']
# scaler = StandardScaler()
# train_data[cols_to_standardise] = scaler.fit_transform(train_data[['age','totChol','sysBP','BMI', 'heartRate', 'glucose', 'cigsPerDay']])#taking all the columns which are to be standardise in an array

# test_data.drop(['currentSmoker', 'diaBP'], axis=1, inplace=True)

# imputer = SimpleImputer(strategy='most_frequent')#Creating an instance of simple Imputer which will be used to fill the null vlaues
# test_data_cols = test_data.columns
# test_data = pd.DataFrame(imputer.fit_transform(test_data), columns=test_data_cols)#fitting the data and filling any null values in the test dataset


# test_data[cols_to_standardise] = scaler.fit_transform(test_data[['age','totChol','sysBP','BMI', 'heartRate', 'glucose', 'cigsPerDay']])#taking all the columns which are to be standardise in an array

# # Extract processed features and labels for training
# X_train_processed = train_data.drop('CHD', axis=1)
# y_train_processed = train_data['CHD']
# X_test_processed = test_data.drop('CHD', axis=1)
# y_test_processed = test_data['CHD']

# from sklearn.tree import DecisionTreeClassifier #importing the descision tree classifier from the sklearn tree 
# tree = DecisionTreeClassifier(max_depth=3) #making an instance the descision tree with maxdepth = 3 as passing the input
# clf = tree.fit(X_train_processed, y_train_processed) #here we are passing our training and the testing data to the tree and fitting it
# y_pred = clf.predict(X_test_processed) #predicting the value by passing the x_test datset to the tree 
# accuracy_score(y_pred, y_test_processed)# here we are printing the accuracy score of the prediction and the testing data

# from sklearn.tree import DecisionTreeClassifier #importing the descision tree classifier from the sklearn tree 
# tree = DecisionTreeClassifier(max_depth=3) #making an instance the descision tree with maxdepth = 3 as passing the input
# clf = tree.fit(X_train_processed, y_train_processed) #here we are passing our training and the testing data to the tree and fitting it
# y_pred = clf.predict(X_test_processed) #predicting the value by passing the x_test datset to the tree 
# accuracy_score(y_pred, y_test_processed)# here we are printing the accuracy score of the prediction and the testing data

# from sklearn.ensemble import RandomForestClassifier #importing the random forest classifier from the sklearn ensemble 
# neigh = RandomForestClassifier(n_estimators=100, random_state=42) #making an instance the random forest with n_estimators = 3 as passing the input
# knnclf = neigh.fit(X_train_processed, y_train_processed) #here we are passing our training and the testing data to the tree and fitting it
# y_pred = knnclf.predict(X_test_processed) #predicting the value by passing the x_test datset to the tree 
# accuracy_score(y_pred, y_test_processed)# here we are printing the accuracy score of the prediction and the testing data

# # Taking user input for prediction
# print("\n" + "="*60)
# print("Heart Disease Prediction System")
# print("="*60 + "\n")

# print("Please enter the patient's information:")
# age = float(input("Age: "))
# male = float(input("Male (0 or 1): "))
# totChol = float(input("Total Cholesterol: "))
# sysBP = float(input("Systolic Blood Pressure: "))
# diaBP = float(input("Diastolic Blood Pressure: "))
# BMI = float(input("BMI: "))
# heartRate = float(input("Heart Rate: "))
# glucose = float(input("Glucose: "))
# cigsPerDay = float(input("Cigarettes per Day: "))

# # Create a DataFrame with the input data
# input_data = pd.DataFrame({
#     'age': [age],
#     'male': [male],
#     'totChol': [totChol],
#     'sysBP': [sysBP],
#     'diaBP': [diaBP],
#     'BMI': [BMI],
#     'heartRate': [heartRate],
#     'glucose': [glucose],
#     'cigsPerDay': [cigsPerDay]
# })

# # Drop the same columns as we did for training data
# input_data.drop(['diaBP'], axis=1, inplace=True)

# # Ensure input_data has the same columns as X_train_processed in the same order
# missing_cols = set(X_train_processed.columns) - set(input_data.columns)
# for col in missing_cols:
#     input_data[col] = 0

# # Reorder columns to match training data
# input_data = input_data[X_train_processed.columns]

# # Standardize the features using the fitted scaler
# input_data[cols_to_standardise] = scaler.transform(input_data[['age','totChol','sysBP','BMI', 'heartRate', 'glucose', 'cigsPerDay']])

# # Make predictions using all three models
# print("\n" + "="*60)
# print("Prediction Results:")
# print("="*60)

# # DecisionTree prediction
# dt_prediction = clf.predict(input_data)
# dt_probability = clf.predict_proba(input_data)
# print(f"\nDecision Tree Classifier:")
# print(f"  Prediction: {'Heart Disease Present' if dt_prediction[0] == 1 else 'No Heart Disease'}")
# print(f"  Confidence: {max(dt_probability[0])*100:.2f}%")

# # RandomForest prediction
# rf_prediction = knnclf.predict(input_data)
# rf_probability = knnclf.predict_proba(input_data)
# print(f"\nRandom Forest Classifier:")
# print(f"  Prediction: {'Heart Disease Present' if rf_prediction[0] == 1 else 'No Heart Disease'}")
# print(f"  Confidence: {max(rf_probability[0])*100:.2f}%")

# # Overall recommendation
# print("\n" + "="*60)
# predictions_list = [dt_prediction[0], rf_prediction[0]]
# if sum(predictions_list) >= 1:
#     print("⚠️  RECOMMENDATION: Medical consultation advised")
# else:
#     print("✓ RECOMMENDATION: No immediate concern detected")
# print("="*60 + "\n")

# import joblib

# joblib.dump(clf, "decision_tree_model.pkl")
# joblib.dump(knnclf, "random_forest_model.pkl")
# joblib.dump(scaler, "scaler.pkl")
# joblib.dump(X_train_processed.columns.tolist(), "columns.pkl")

# print("Models saved successfully!")



# Generated from: heart_disease_prediction.ipynb
# Converted at: 2026-02-08T10:09:39.278Z
# Next step (optional): refactor into modules & generate tests with RunCell
# Quick start: pip install runcell

import numpy as np #importing the numpy module which will be used in this project
import pandas as pd#importing the pandas module which will be used in this project
import matplotlib.pyplot as plt#importing the matplotlib module which will be used in this project
import seaborn as sns#importing the seaborn module which will be used in this project
from sklearn.model_selection import train_test_split#importing the sklearn module which will be used in this project

dataframe = pd.read_csv('dataset.csv')#reading our dataset using read_csv function
dataframe.head() #printing the first 5 columns of our dataset using head function

dataframe.drop('education', axis=1, inplace=True)#dropping unnecessary column education becuase this column won't impact the chances of a person having a heart attack

dataframe.rename(columns={"TenYearCHD": "CHD"}, inplace=True) #changing the column name of TenYearCHD

dataframe.head()#printing the dataset again using head funciton

x = dataframe.iloc[:,:-1]
y = dataframe.iloc[:,-1]
X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.20)

train_data = pd.concat([X_train, y_train], axis=1)
test_data = pd.concat([X_test, y_test], axis=1)

sns.countplot(x=train_data['male']) ##plotting a count plot of male using sns.countplot

sns.countplot(x=train_data['male'], hue=train_data['CHD']) ##plotting a count plot of CHD and male having disease or not using sns.countplot

plt.figure(figsize=(15,15))#plotting a figure of size 15 and 15
sns.heatmap(train_data.corr(), annot=True, linewidths=0.1) #plotting a heatmat of dataframe correlation

train_data.drop(['currentSmoker', 'diaBP'], axis=1, inplace=True)#dropping the column becuase they are correlated very high

train_data = train_data[~(train_data['sysBP'] > 220)] #deleting the outliers values in sysBP of training data
train_data = train_data[~(train_data['BMI'] > 43)]#deleting the outliers values in BMI of training data
train_data = train_data[~(train_data['heartRate'] > 125)]#deleting the outliers values in heartRate of training data
train_data = train_data[~(train_data['glucose'] > 200)]#deleting the outliers values in glucose of training data
train_data = train_data[~(train_data['totChol'] > 450)]#deleting the outliers values in totChol of training data

from sklearn.preprocessing import StandardScaler #importing the standard scaler library
from sklearn.impute import SimpleImputer #importing the simple imputer library
from sklearn.metrics import accuracy_score #importing the accuracy score function

cols_to_standardise = ['age','totChol','sysBP','BMI', 'heartRate', 'glucose', 'cigsPerDay']
scaler = StandardScaler()
train_data[cols_to_standardise] = scaler.fit_transform(train_data[['age','totChol','sysBP','BMI', 'heartRate', 'glucose', 'cigsPerDay']])#taking all the columns which are to be standardise in an array

test_data.drop(['currentSmoker', 'diaBP'], axis=1, inplace=True)

imputer = SimpleImputer(strategy='most_frequent')#Creating an instance of simple Imputer which will be used to fill the null vlaues
test_data_cols = test_data.columns
test_data = pd.DataFrame(imputer.fit_transform(test_data), columns=test_data_cols)#fitting the data and filling any null values in the test dataset


test_data[cols_to_standardise] = scaler.fit_transform(test_data[['age','totChol','sysBP','BMI', 'heartRate', 'glucose', 'cigsPerDay']])#taking all the columns which are to be standardise in an array

# Extract processed features and labels for training
X_train_processed = train_data.drop('CHD', axis=1)
y_train_processed = train_data['CHD']
X_test_processed = test_data.drop('CHD', axis=1)
y_test_processed = test_data['CHD']

from sklearn.tree import DecisionTreeClassifier #importing the descision tree classifier from the sklearn tree 
tree = DecisionTreeClassifier(max_depth=3) #making an instance the descision tree with maxdepth = 3 as passing the input
clf = tree.fit(X_train_processed, y_train_processed) #here we are passing our training and the testing data to the tree and fitting it
y_pred = clf.predict(X_test_processed) #predicting the value by passing the x_test datset to the tree 
accuracy_score(y_pred, y_test_processed)# here we are printing the accuracy score of the prediction and the testing data

from sklearn.tree import DecisionTreeClassifier #importing the descision tree classifier from the sklearn tree 
tree = DecisionTreeClassifier(max_depth=3) #making an instance the descision tree with maxdepth = 3 as passing the input
clf = tree.fit(X_train_processed, y_train_processed) #here we are passing our training and the testing data to the tree and fitting it
y_pred = clf.predict(X_test_processed) #predicting the value by passing the x_test datset to the tree 
accuracy_score(y_pred, y_test_processed)# here we are printing the accuracy score of the prediction and the testing data

from sklearn.ensemble import RandomForestClassifier #importing the random forest classifier from the sklearn ensemble 
neigh = RandomForestClassifier(n_estimators=100, random_state=42) #making an instance the random forest with n_estimators = 3 as passing the input
knnclf = neigh.fit(X_train_processed, y_train_processed) #here we are passing our training and the testing data to the tree and fitting it
y_pred = knnclf.predict(X_test_processed) #predicting the value by passing the x_test datset to the tree 
accuracy_score(y_pred, y_test_processed)# here we are printing the accuracy score of the prediction and the testing data

# Taking user input for prediction
print("\n" + "="*60)
print("Heart Disease Prediction System")
print("="*60 + "\n")

print("Please enter the patient's information:")
age = float(input("Age: "))
male = float(input("Male (0 or 1): "))
totChol = float(input("Total Cholesterol: "))
sysBP = float(input("Systolic Blood Pressure: "))
diaBP = float(input("Diastolic Blood Pressure: "))
BMI = float(input("BMI: "))
heartRate = float(input("Heart Rate: "))
glucose = float(input("Glucose: "))
cigsPerDay = float(input("Cigarettes per Day: "))
# ------------------ COVID RELATED QUESTIONS ------------------

had_covid = float(input("Had COVID infection? (0 = No, 1 = Yes): "))
covid_severity = float(input("COVID Severity (0 = No Covid, 1 = Mild, 2 = Hospitalized, 3 = ICU): "))


vaccinated = float(input("Vaccinated? (0 = No, 1 = Yes): "))
oxygen_support = float(input("Required Oxygen Support during COVID? (0 = No, 1 = Yes): "))

# Create a DataFrame with the input data
input_data = pd.DataFrame({
    'age': [age],
    'male': [male],
    'totChol': [totChol],
    'sysBP': [sysBP],
    'diaBP': [diaBP],
    'BMI': [BMI],
    'heartRate': [heartRate],
    'glucose': [glucose],
    'cigsPerDay': [cigsPerDay]
})

# Drop the same columns as we did for training data
input_data.drop(['diaBP'], axis=1, inplace=True)

# Ensure input_data has the same columns as X_train_processed in the same order
missing_cols = set(X_train_processed.columns) - set(input_data.columns)
for col in missing_cols:
    input_data[col] = 0

# Reorder columns to match training data
input_data = input_data[X_train_processed.columns]

# Standardize the features using the fitted scaler
input_data[cols_to_standardise] = scaler.transform(input_data[['age','totChol','sysBP','BMI', 'heartRate', 'glucose', 'cigsPerDay']])

# Make predictions using all three models
print("\n" + "="*60)
print("Prediction Results:")
print("="*60)

# DecisionTree prediction
dt_prediction = clf.predict(input_data)
dt_probability = clf.predict_proba(input_data)
print(f"\nDecision Tree Classifier:")
print(f"  Prediction: {'Heart Disease Present' if dt_prediction[0] == 1 else 'No Heart Disease'}")
print(f"  Confidence: {max(dt_probability[0])*100:.2f}%")

# RandomForest prediction
rf_prediction = knnclf.predict(input_data)
rf_probability = knnclf.predict_proba(input_data)
print(f"\nRandom Forest Classifier:")
print(f"  Prediction: {'Heart Disease Present' if rf_prediction[0] == 1 else 'No Heart Disease'}")
print(f"  Confidence: {max(rf_probability[0])*100:.2f}%")

# Overall recommendation
print("\n" + "="*60)
predictions_list = [dt_prediction[0], rf_prediction[0]]
if sum(predictions_list) >= 1:
    print("⚠️  RECOMMENDATION: Medical consultation advised")
else:
    print("✓ RECOMMENDATION: No immediate concern detected")
print("="*60 + "\n")

import joblib

joblib.dump(clf, "decision_tree_model.pkl")
joblib.dump(knnclf, "random_forest_model.pkl")
joblib.dump(scaler, "scaler.pkl")
joblib.dump(X_train_processed.columns.tolist(), "columns.pkl")

print("Models saved successfully!")