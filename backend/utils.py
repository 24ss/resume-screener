import PyPDF2
import pdfplumber
from docx import Document
import re
import io
from typing import Optional

def extract_text_from_pdf_pypdf2(file_content: bytes) -> str:
    """Extract text from PDF using PyPDF2"""
    try:
        print(f"📄 PyPDF2: Processing {len(file_content)} bytes")

        if len(file_content) == 0:
            raise Exception("PDF file is empty")

        if not file_content.startswith(b'%PDF'):
            raise Exception("File doesn't appear to be a valid PDF")

        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""

        print(f"📖 PyPDF2: PDF has {len(pdf_reader.pages)} pages")

        for page_num, page in enumerate(pdf_reader.pages):
            try:
                page_text = page.extract_text() or ""
                text += page_text + "\n"
                print(f"📄 Page {page_num + 1}: {len(page_text)} chars")
            except Exception as e:
                print(f"⚠️ Error on page {page_num + 1}: {e}")
                continue

        return text.strip()

    except Exception as e:
        raise Exception(f"PyPDF2 failed: {str(e)}")

def extract_text_from_pdf_pdfplumber(file_content: bytes) -> str:
    """Extract text from PDF using pdfplumber"""
    try:
        print(f"📄 pdfplumber: Processing {len(file_content)} bytes")

        with pdfplumber.open(io.BytesIO(file_content)) as pdf:
            text = ""
            print(f"📖 pdfplumber: PDF has {len(pdf.pages)} pages")

            for page_num, page in enumerate(pdf.pages):
                try:
                    page_text = page.extract_text() or ""
                    text += page_text + "\n"
                    print(f"📄 Page {page_num + 1}: {len(page_text)} chars")
                except Exception as e:
                    print(f"⚠️ Error on page {page_num + 1}: {e}")
                    continue

            return text.strip()

    except Exception as e:
        raise Exception(f"pdfplumber failed: {str(e)}")

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file with fallback methods"""
    print(f"📁 Starting PDF extraction: {len(file_content)} bytes")

    if len(file_content) == 0:
        raise Exception("PDF file is empty")

    # Try PyPDF2 first
    try:
        text = extract_text_from_pdf_pypdf2(file_content)
        if len(text.strip()) > 20:  # Must have meaningful content
            print(f"✅ PyPDF2 success: {len(text)} characters")
            return text
        else:
            print("⚠️ PyPDF2 extracted very little text")
    except Exception as e1:
        print(f"⚠️ PyPDF2 failed: {e1}")

    # Try pdfplumber as fallback
    try:
        text = extract_text_from_pdf_pdfplumber(file_content)
        if len(text.strip()) > 20:
            print(f"✅ pdfplumber success: {len(text)} characters")
            return text
        else:
            raise Exception("Both methods extracted very little text")
    except Exception as e2:
        print(f"❌ pdfplumber also failed: {e2}")
        raise Exception("PDF text extraction failed. File may be image-based, encrypted, or corrupted.")

def extract_text_from_docx(file_content: bytes) -> str:
    """Extract text from DOCX file"""
    try:
        print(f"📄 DOCX: Processing {len(file_content)} bytes")

        doc = Document(io.BytesIO(file_content))
        text = ""
        paragraph_count = 0

        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                text += paragraph.text + "\n"
                paragraph_count += 1

        print(f"✅ DOCX: {paragraph_count} paragraphs, {len(text)} characters")

        if len(text.strip()) < 20:
            raise Exception("Very little text extracted from DOCX")

        return text.strip()

    except Exception as e:
        raise Exception(f"Error extracting DOCX text: {str(e)}")

def preprocess_resume_text(text: str) -> str:
    """Clean and preprocess resume text"""
    print(f"🧹 Preprocessing {len(text)} characters")

    # Remove extra whitespace and newlines
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'\s+', ' ', text)

    # Remove special characters but keep important punctuation
    text = re.sub(r'[^a-zA-Z0-9\s.,;:()\-+@#%&]', ' ', text)

    # Remove extra spaces
    text = re.sub(r'\s+', ' ', text)

    cleaned = text.strip()
    print(f"✅ Preprocessing done: {len(cleaned)} characters")
    return cleaned

def get_file_extension(filename: str) -> Optional[str]:
    """Get file extension from filename"""
    return filename.split('.')[-1].lower() if '.' in filename else None

def validate_file_type(filename: str) -> bool:
    """Validate if file type is supported"""
    ext = get_file_extension(filename)
    is_valid = ext in ['pdf', 'docx']
    print(f"📋 File validation: {filename} -> {ext} -> {'✅ Valid' if is_valid else '❌ Invalid'}")
    return is_valid
