# extract_keyword.py
import sys
import json
import os
import openai
from rake_nltk import Rake
from dotenv import load_dotenv
from nltk.corpus import stopwords

load_dotenv()

# Use OpenAI API key from environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    print("Error: OPENAI_API_KEY not found in environment variables.", file=sys.stderr)
    sys.exit(1)

# Initialize RAKE and stopwords
rake_extractor = Rake()
try:
    stop_words = set(stopwords.words('english'))
except LookupError:
    import nltk
    nltk.download('stopwords')
    stop_words = set(stopwords.words('english'))

# AI-based topic extraction

def ai_extract_topic(query, openai_api_key):
    openai.api_key = openai_api_key
    prompt = (
        "Extract the main news topic or entity from the following query. "
        "Respond with a single word or short phrase only.\n\nQuery: " + query + "\nTopic:"
    )
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that extracts the main news topic or entity from a user query. Respond with a single word or short phrase only."},
            {"role": "user", "content": query}
        ],
        max_tokens=10,
        temperature=0
    )
    topic = response.choices[0].message['content'].strip()
    return topic

def fallback_keyword_extraction(text):
    # Use RAKE to extract keywords, filter out stopwords
    rake_extractor.extract_keywords_from_text(text)
    keywords = rake_extractor.get_ranked_phrases()
    # Remove stopwords and return the first non-stopword keyword
    for kw in keywords:
        filtered = " ".join([word for word in kw.split() if word.lower() not in stop_words])
        if filtered:
            return filtered
    # If nothing found, return the original text
    return text.strip()

def robust_topic_extraction(user_input):
    if not user_input or not user_input.strip():
        return ""
    try:
        # Use OpenAI GPT-4o for topic extraction
        topic = ai_extract_topic(user_input, OPENAI_API_KEY)
        if topic:
            return topic
        # Fallback to keyword extraction if no topic
        return fallback_keyword_extraction(user_input)
    except Exception as e:
        print(f"Error extracting keywords: {str(e)}", file=sys.stderr)
        return fallback_keyword_extraction(user_input)

if __name__ == "__main__":
    try:
        if len(sys.argv) > 1:
            user_query = " ".join(sys.argv[1:])
        else:
            user_query = input("Enter your news query: ")
        if not user_query or not user_query.strip():
            print("Error: Empty query provided", file=sys.stderr)
            sys.exit(1)
        result = robust_topic_extraction(user_query)
        print(f"[Extracted Topic]: {result}", file=sys.stderr)
        print(json.dumps([result]))
    except Exception as e:
        print(f"An error occurred: {str(e)}", file=sys.stderr)
        sys.exit(1)