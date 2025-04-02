from google.cloud import firestore
import time

# Try to get the version directly from the module, if available
try:
    firestore_version = firestore.__version__
except AttributeError:
    # Fallback: use pkg_resources to get the version info
    import pkg_resources
    firestore_version = pkg_resources.get_distribution("google-cloud-firestore").version

print("Firestore library version used:", firestore_version)

# Initialize Firestore client
db = firestore.Client()

def add_ai_model(model_id, name, model_type, is_free, description, metadata=None):
    """
    Adds a new AI model to the 'aimodels' collection.
    """
    aimodels_ref = db.collection('aimodels')
    model_ref = aimodels_ref.document(model_id)
    
    model_data = {
        'name': name,
        'type': model_type,
        'model_id': model_id,
        'is_free': is_free,
        'description': description,
        'created_at': int(time.time()),
        'updated_at': int(time.time()),
        'metadata': metadata or {}
    }
    
    model_ref.set(model_data)
    print(f"AI Model '{name}' added with ID: {model_id}")

def add_dummy_subcollection_data(model_id):
    """
    Creates a subcollection under the given model document and adds dummy data.
    """
    model_ref = db.collection('aimodels').document(model_id)
    # Define the subcollection name
    subcollection_ref = model_ref.collection('dummySubcollection')
    
    # Create dummy documents in the subcollection
    dummy_documents = [
        {'dummy_field': 'dummy_value_1', 'timestamp': int(time.time())},
        {'dummy_field': 'dummy_value_2', 'timestamp': int(time.time())},
    ]
    
    for data in dummy_documents:
        # Using add() to generate an auto-ID for each document
        subcollection_ref.add(data)
    
    print(f"Dummy subcollection data added to model ID: {model_id}")

def count_ai_models():
    """
    Prints the total count of documents in the 'aimodels' collection.
    """
    aimodels_ref = db.collection('aimodels')
    # Using an aggregation query with count()
    count = aimodels_ref.count().get()[0][0].value 
    print("Total AI Models count:", count)

def count_dummy_subcollection(model_id):
    """
    Prints the total count of documents in the 'dummySubcollection' subcollection.
    """
    subcollection_ref = db.collection_group('dummySubcollection')
    count = subcollection_ref.count().get()[0][0].value
    print(f"Total dummy documents in subcollection for model {model_id}:", count)

if __name__ == '__main__':
    # Parameters for the new AI model
    model_id = "model_12"
    name = "ChatGPT"
    model_type = "NLP"
    is_free = True
    description = "A dummy AI model for chat."
    
    # Add the AI model to the 'aimodels' collection
    add_ai_model(model_id, name, model_type, is_free, description)
    
    # Add dummy data in a subcollection under the new model document
    add_dummy_subcollection_data(model_id)
    
    # Count documents in the main collection
    count_ai_models()
    
    # Count documents in the subcollection for the given model
    count_dummy_subcollection(model_id)
