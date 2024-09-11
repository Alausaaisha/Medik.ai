import joblib

# Save a simple object
test_object = {'key': 'value'}
joblib.dump(test_object, 'test.joblib')

# Load the object
loaded_object = joblib.load('test.joblib')
print(loaded_object)

import sklearn
print(sklearn.__version__)
