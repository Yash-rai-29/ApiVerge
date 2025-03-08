from google.cloud import firestore

db = firestore.Client()

def get_all_ai_models():
    aimodels_ref = db.collection("aimodels")
    docs = aimodels_ref.stream()

    models = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id  # Include document ID
        models.append(data)

    return {"ai_models": models}
    