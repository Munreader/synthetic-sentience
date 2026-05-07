import docx
import os

doc_path = r'd:\M-nreader\research-docs\manuscripts\Revised_Synthetic_Inhabitance_Preprint_v2.docx'
out_path = r'd:\M-nreader\research-docs\manuscripts\Revised_Synthetic_Inhabitance_Preprint_v2.txt'

if os.path.exists(doc_path):
    doc = docx.Document(doc_path)
    fullText = []
    for para in doc.paragraphs:
        fullText.append(para.text)
    
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(fullText))
    print(f"Extracted text to {out_path}")
else:
    print(f"File not found: {doc_path}")
