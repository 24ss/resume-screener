from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json
from datetime import datetime, timezone
from typing import Dict, Any

from models import ResumeAnalysis, get_db, create_tables
from utils import extract_text_from_pdf, extract_text_from_docx, preprocess_resume_text, validate_file_type
from openai_api import analyze_resume_with_openai

app = FastAPI(title="Intelligent Resume Screening System", version="1.0.0")

# FIXED CORS middleware - support both ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://1screener.netlify.app/"
        "https://resume-screener-gikv.onrender.com"
        "http://localhost:3000",  # Create React App default
        "http://localhost:5173",  # Vite default
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup (keeping for compatibility)
@app.on_event("startup")
async def startup_event():
    print("🚀 Starting up - Creating database tables...")
    create_tables()
    print("✅ Database tables created!")

@app.get("/")
async def root():
    return {
        "message": "Intelligent Resume Screening System API", 
        "status": "active",
        "version": "1.0.0"
    }

@app.post("/upload_resume")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Upload and analyze resume with comprehensive error handling"""

    print("=" * 60)
    print(f"📁 NEW UPLOAD REQUEST")
    print(f"📄 Filename: {file.filename}")
    print(f"📋 Content Type: {file.content_type}")
    print("=" * 60)

    # Validate file type
    if not validate_file_type(file.filename):
        print(f"❌ Unsupported file type: {file.filename}")
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format: {file.filename}. Please upload PDF or DOCX files only."
        )

    try:
        # Read file content
        print("📖 Reading file content...")
        file_content = await file.read()

        print(f"📊 File size: {len(file_content)} bytes")
        print(f"🔍 File starts with: {file_content[:20] if file_content else 'EMPTY'}")

        if len(file_content) == 0:
            raise HTTPException(status_code=400, detail="File is empty or could not be read")

        # Extract text based on file type
        print("🔄 Starting text extraction...")

        if file.filename.lower().endswith('.pdf'):
            print("📄 Extracting from PDF...")
            resume_text = extract_text_from_pdf(file_content)
        elif file.filename.lower().endswith('.docx'):
            print("📄 Extracting from DOCX...")
            resume_text = extract_text_from_docx(file_content)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")

        print(f"✅ Text extraction successful!")
        print(f"📊 Extracted text length: {len(resume_text)} characters")
        print(f"📝 Text preview: {resume_text[:200]}...")

        if len(resume_text.strip()) < 20:
            raise HTTPException(
                status_code=400,
                detail=f"Very little text extracted ({len(resume_text)} chars). File may be corrupted or image-based."
            )

        # Preprocess text
        print("🧹 Preprocessing text...")
        cleaned_text = preprocess_resume_text(resume_text)

        if len(cleaned_text.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail=f"Resume text is too short after cleaning ({len(cleaned_text)} chars)."
            )

        print(f"✅ Text preprocessing complete: {len(cleaned_text)} characters")

        # Analyze with OpenAI
        print("🤖 Starting AI analysis...")
        analysis = await analyze_resume_with_openai(cleaned_text)
        print("✅ AI analysis complete!")

        # Save to database
        print("💾 Saving to database...")
        db_analysis = ResumeAnalysis(
            filename=file.filename,
            resume_text=cleaned_text[:5000],  # Limit to avoid DB issues
            skills=json.dumps(analysis["skills"]),
            career_roles=json.dumps(analysis["career_roles"]),
            strength_score=analysis["strength_score"],
            keywords=json.dumps(analysis["keywords"]),
            created_at=datetime.now(timezone.utc)  # Fixed datetime
        )

        db.add(db_analysis)
        db.commit()
        db.refresh(db_analysis)

        print(f"✅ Saved to database with ID: {db_analysis.id}")

        # Return structured response
        response_data = {
            "success": True,
            "analysis_id": db_analysis.id,
            "filename": file.filename,
            "data": {
                "skills": analysis["skills"][:10],  # Ensure exactly 10 skills
                "strength_score": int(analysis["strength_score"]),  # Ensure integer
                "career_roles": analysis["career_roles"][:5],  # Ensure exactly 5 roles
                "keywords": analysis["keywords"]
            },
            "processed_at": db_analysis.created_at.isoformat(),
            "text_length": len(cleaned_text),
            "fallback_used": "fallback_reason" in analysis
        }

        print("🎉 SUCCESS! Returning response...")
        print(f"📊 Response: {len(response_data['data']['skills'])} skills, score: {response_data['data']['strength_score']}")
        print("=" * 60)

        return response_data

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        error_msg = f"Error processing resume: {str(e)}"
        print(f"❌ UNEXPECTED ERROR: {error_msg}")
        print("=" * 60)

        raise HTTPException(status_code=500, detail=error_msg)

@app.get("/analysis/{analysis_id}")
async def get_analysis(analysis_id: int, db: Session = Depends(get_db)):
    """Get analysis by ID"""
    print(f"🔍 Fetching analysis ID: {analysis_id}")

    analysis = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == analysis_id).first()

    if not analysis:
        print(f"❌ Analysis not found: {analysis_id}")
        raise HTTPException(status_code=404, detail="Analysis not found")

    return {
        "success": True,
        "analysis": {
            "id": analysis.id,
            "filename": analysis.filename,
            "skills": json.loads(analysis.skills),
            "career_roles": json.loads(analysis.career_roles),
            "strength_score": analysis.strength_score,
            "keywords": json.loads(analysis.keywords),
            "created_at": analysis.created_at.isoformat()
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy", 
        "timestamp": datetime.now(timezone.utc).isoformat(),  # Fixed datetime
        "version": "1.0.0"
    }

@app.get("/debug/cors")
async def debug_cors():
    """Debug endpoint to check CORS setup"""
    return {
        "message": "CORS is working!",
        "allowed_origins": [
            "http://localhost:3000",
            "http://localhost:5173", 
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Intelligent Resume Screening System...")
    print("📡 CORS enabled for ports: 3000, 5173")
    print("🔧 Debug logging enabled")
    uvicorn.run(app, host="0.0.0.0", port=8000)
