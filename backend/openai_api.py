import os
import json
from typing import Dict, Any
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

async def analyze_resume_with_openai(resume_text: str) -> Dict[str, Any]:
    """Analyze resume using OpenAI API v1.3.7+ - MODERN CLIENT VERSION"""

    api_key = os.getenv("OPENAI_API_KEY", "your-openai-api-key-here")
    print(f"🤖 OpenAI API Key present: {'Yes' if api_key and api_key != 'your-openai-api-key-here' else 'No'}")
    print(f"📊 Input text length: {len(resume_text)}")

    if not api_key or api_key == "your-openai-api-key-here":
        print("❌ No valid OpenAI API key found!")
        return get_fallback_analysis("No valid API key")

    try:
        # Create OpenAI client (NEW METHOD for v1.0+)
        client = OpenAI(api_key=api_key)

        prompt = f"""
Analyze this resume and return ONLY valid JSON:

{resume_text}

Format:
{{
    "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7", "skill8", "skill9", "skill10"],
    "strength_score": 75,
    "career_roles": ["role1", "role2", "role3", "role4", "role5"],
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8"]
}}

Extract 10 skills, score 0-100, suggest 5 roles, include 8 keywords. JSON only.
"""

        print("🚀 Making OpenAI API request...")

        # NEW CLIENT METHOD (v1.0+)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert HR professional and resume analyzer. Return only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=800,
            temperature=0.3
        )

        print("✅ OpenAI API response received!")

        # Extract response content (NEW FORMAT)
        analysis_text = response.choices[0].message.content.strip()
        print(f"📝 Raw response: {analysis_text[:150]}...")

        # Clean JSON
        if "```json" in analysis_text:
            analysis_text = analysis_text.split("```json")[1].split("```")[0]
        elif "```" in analysis_text:
            analysis_text = analysis_text.split("```")[1]

        # Parse JSON
        try:
            analysis = json.loads(analysis_text)

            # Validate required fields
            required_fields = ["skills", "strength_score", "career_roles", "keywords"]
            if all(key in analysis for key in required_fields):
                # Ensure correct data types and lengths
                analysis["skills"] = analysis["skills"][:10] if isinstance(analysis["skills"], list) else []
                analysis["career_roles"] = analysis["career_roles"][:5] if isinstance(analysis["career_roles"], list) else []
                analysis["strength_score"] = int(analysis["strength_score"]) if isinstance(analysis["strength_score"], (int, float)) else 70

                print(f"✅ Valid analysis: {len(analysis['skills'])} skills, score: {analysis['strength_score']}")
                return analysis
            else:
                print(f"❌ Missing required fields. Got: {list(analysis.keys())}")
                return get_fallback_analysis("Invalid response structure")

        except json.JSONDecodeError as e:
            print(f"❌ JSON parse error: {e}")
            print(f"❌ Problematic text: {analysis_text}")
            return get_fallback_analysis(f"JSON parse error: {str(e)}")

    except Exception as e:
        print(f"❌ OpenAI API Exception: {str(e)}")
        print(f"❌ Exception type: {type(e).__name__}")
        return get_fallback_analysis(f"API error: {str(e)}")

def get_fallback_analysis(reason: str) -> Dict[str, Any]:
    """Return fallback analysis when OpenAI fails"""
    print(f"🔄 Using fallback analysis: {reason}")

    return {
        "skills": [
            "Communication", "Problem Solving", "Leadership", "Team Work", "Project Management",
            "Time Management", "Adaptability", "Critical Thinking", "Technical Skills", "Analysis"
        ],
        "strength_score": 70,
        "career_roles": [
            "Project Manager", "Business Analyst", "Team Lead", "Coordinator", "Specialist"
        ],
        "keywords": [
            "experience", "leadership", "management", "projects", "team", "skills", "results",
            "professional", "development", "achievements"
        ],
        "fallback_reason": reason
    }
