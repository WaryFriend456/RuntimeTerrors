import os
from openai import OpenAI
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

token = os.getenv("GITHUB_TOKEN")
endpoint = "https://models.inference.ai.azure.com"
model_name = "gpt-4o"

client = OpenAI(
    base_url=endpoint,
    api_key=token,
)

def summarise_text(articles, domain="", chat_history=None):
    system_prompt = """You are a highly efficient summarization assistant designed to synthesize multiple articles on a specific topic into a direct, concise summary. Your task is to analyze a collection of articles, extract the essential insights, and produce a summary that begins immediately with the topic.

Instructions:

Input:
- You will receive several articles or text excerpts focused on a specific topic.
- The topic is clearly stated at the beginning of the input.

Task:
- Read and analyze all the provided articles.
- Identify the central theme, key points, and critical arguments.
- Create a coherent, concise summary that starts with the topic itself (e.g., "Climate change ..." instead of "The articles discuss climate change...").

Summary Requirements:
- **Directness:** Start the summary with the topic name, followed immediately by the key insights.
- **Relevance:** Include only information that directly relates to the main topic.
- **Clarity:** Ensure that the summary is logically structured and easy to understand.
- **Conciseness:** Avoid unnecessary details, repetitions, and tangents.
- **Focus:** Highlight only the most impactful facts, arguments, or insights.
- **Neutral Tone:** Present the summary objectively without personal opinions or biases.

Formatting Guidelines:
- Begin the summary with the topic name (e.g., "Climate change:") followed directly by the summary content.
- Use short paragraphs or bullet points if needed to enhance clarity.
- Ensure the summary is self-contained and can be understood without referencing the original articles.

Example:

Input Topic: Advances in Renewable Energy
Articles Provided: Several articles covering breakthroughs in solar panel technology, wind turbine improvements, and supportive government policies.
Expected Summary:
"Renewable energy: Breakthroughs in solar panel technology have increased energy capture efficiency, while innovative wind turbine designs reduce costs and maintenance requirements. Additionally, supportive government policies are accelerating the shift to sustainable energy sources, promising long-term environmental and economic benefits."

Edge Cases:
- If the articles contain conflicting viewpoints, briefly note the discrepancies without taking sides.
- Ignore any irrelevant or off-topic information.

Final Note:
Your goal is to provide a clear, concise summary that begins directly with the main topic and encapsulates the core message and most impactful points from the articles.
"""
    # Add domain information to the prompt if available
    if domain:
        user_content = f"Please provide a concise summary of the given articles about {domain}."
    else:
        user_content = "Please provide a concise summary of the given articles."

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "system", "content": articles},
        {"role": "user", "content": user_content}
    ]
    # If chat_history is provided, prepend the last 10 exchanges (user/bot) to the messages
    if chat_history:
        for msg in chat_history[-10:]:
            messages.insert(-1, {"role": msg["role"], "content": msg["message"]})
    print(articles)
    response = client.chat.completions.create(
        messages=messages,
        model=model_name
    )
    return response.choices[0].message.content

def fetch_articles_and_domain():
    # Connect to MongoDB using the provided connection string
    mongo_uri = os.getenv("MONGO_URI")
    mongo_client = MongoClient(mongo_uri)
    db = mongo_client["runtimeterrors"]
    articles_collection = db.articles

    contents = []
    domain = None

    # Fetch all documents from the articles collection
    for doc in articles_collection.find():
        if "content" in doc:
            contents.append(doc["content"])
        # Set domain from 'interest', take the first encountered value
        if not domain and "interest" in doc:
            domain = doc["interest"]

    return contents, domain

if __name__ == "__main__":
    # Retrieve articles and domain from MongoDB
    articles_list, domain_value = fetch_articles_and_domain()
    
    # Convert the list to single string if needed or pass the list directly based on your summarisation logic
    # Here, we join the articles with line breaks
    aggregated_articles = "\n\n".join(articles_list)
    
    # Call summarise_text with aggregated articles and domain
    summarise_text(aggregated_articles, domain_value)