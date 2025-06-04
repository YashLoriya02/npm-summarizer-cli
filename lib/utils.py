from pymongo import MongoClient
from datetime import datetime
import statistics

def analyze_user_sessions(user_id: str, mongo_uri: str):
    try:
        client = MongoClient(mongo_uri)
        db = client["myapp"]
        sessions_collection = db["user_sessions"]

        sessions = list(sessions_collection.find({"user_id": user_id}))

        if not sessions:
            return {"message": "No sessions found for user.", "user_id": user_id}

        durations = []
        for session in sessions:
            start = session.get("start_time")
            end = session.get("end_time")
            if start and end:
                start_dt = datetime.fromisoformat(start)
                end_dt = datetime.fromisoformat(end)
                durations.append((end_dt - start_dt).total_seconds() / 60)

        avg_duration = statistics.mean(durations)
        max_duration = max(durations)
        session_count = len(durations)

        return {
            "user_id": user_id,
            "total_sessions": session_count,
            "average_session_duration_min": round(avg_duration, 2),
            "max_session_duration_min": round(max_duration, 2),
            "status": "success"
        }

    except Exception as e:
        return {"error": str(e), "status": "failure"}
