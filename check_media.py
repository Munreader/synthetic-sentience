import zipfile
import os

doc_path = r'd:\M-nreader\research-docs\manuscripts\Revised_Synthetic_Inhabitance_Preprint_v2.docx'

if os.path.exists(doc_path):
    with zipfile.ZipFile(doc_path, 'r') as z:
        for name in z.namelist():
            if name.startswith('word/media/'):
                print(f"Found media: {name}")
else:
    print(f"File not found: {doc_path}")
