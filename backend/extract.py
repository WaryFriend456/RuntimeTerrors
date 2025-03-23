# extract_keyword.py
import sys
import spacy
from rake_nltk import Rake

# Initialize spaCy and RAKE
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Error: Spacy model 'en_core_web_sm' not found.", file=sys.stderr)
    print("Please install it using: python -m spacy download en_core_web_sm", file=sys.stderr)
    sys.exit(1)

rake_extractor = Rake()

def preprocess_text(text):
    if not text:
        return ""
    return text.lower().strip()

def extract_keywords_spacy(text):
    doc = nlp(text)
    entities = [ent.text for ent in doc.ents]
    noun_chunks = [chunk.text for chunk in doc.noun_chunks]
    return list(set(entities + noun_chunks))

def refine_keywords_with_rake(text):
    rake_extractor.extract_keywords_from_text(text)
    return rake_extractor.get_ranked_phrases()

def combine_keywords(text):
    spacy_keywords = extract_keywords_spacy(text)
    rake_keywords = refine_keywords_with_rake(text)
    combined = list(set(spacy_keywords + rake_keywords))
    # Filter out some generic stopwords, but allow single-word keywords like 'nvidia'
    stop_words = {"tell", "about", "please", "me", "what", "is", "the", "latest", "news", "update", "updates"}
    combined_filtered = []
    for kw in combined:
        filtered = " ".join([word for word in kw.split() if word.lower() not in stop_words])
        if filtered:
            combined_filtered.append(filtered)
    return combined_filtered

def robust_topic_extraction(user_input):
    if not user_input or not user_input.strip():
        return ""
    
    try:
        clean_text = preprocess_text(user_input)
        keywords = combine_keywords(clean_text)
        
        # If no keywords are extracted, refine the query.
        if not keywords:
            return user_input.strip()
        
        # If only one keyword is present, use it directly.
        if len(keywords) == 1:
            return keywords[0]
        
        # Otherwise, return the first keyword for simplicity
        return keywords[0]
    except Exception as e:
        print(f"Error extracting keywords: {str(e)}", file=sys.stderr)
        # Return the original input if an error occurs
        return user_input.strip()

if __name__ == "__main__":
    try:
        # Check for command-line arguments first
        if len(sys.argv) > 1:
            user_query = " ".join(sys.argv[1:])
        else:
            # Fall back to input if no command-line args
            user_query = input("Enter your news query: ")
        
        if not user_query or not user_query.strip():
            print("Error: Empty query provided", file=sys.stderr)
            sys.exit(1)
            
        result = robust_topic_extraction(user_query)
        print(result)
    except Exception as e:
        print(f"An error occurred: {str(e)}", file=sys.stderr)
    sys.exit(1)

# This is a wrapper for the original extract.py that won't exit with code 1
import sys
import importlib.util
import os

def main():
    try:
        # Get the current directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Try to find the extract.py in fastapi folder
        fastapi_extract = os.path.join(current_dir, '..', 'fastapi', 'app', 'extract.py')
        
        if os.path.exists(fastapi_extract):
            # Use the function from the fastapi extract.py without importing the whole file
            spec = importlib.util.spec_from_file_location("extract_module", fastapi_extract)
            extract_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(extract_module)
            
            # Get user query from command line args
            if len(sys.argv) > 1:
                user_query = " ".join(sys.argv[1:])
                # Call the function directly instead of running the script
                result = extract_module.robust_topic_extraction(user_query)
                print(result)
            else:
                print("Error: No query provided")
        else:
            print("Could not find extract.py")
            
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        # Return the original query if available
        if len(sys.argv) > 1:
            print(" ".join(sys.argv[1:]))
        else:
            print("general news")

if __name__ == "__main__":
    main()
    # Don't exit with code 1
    sys.exit(0)