import os
from openai import OpenAI
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

token = os.getenv("GITHUB_TOKEN")
endpoint = "https://models.inference.ai.azure.com"
model_name = "o3-mini"

client = OpenAI(
    base_url=endpoint,
    api_key=token,
)

def summarise_text(articles, domain=""):
    system_prompt = """You are an advanced summarization assistant designed to process multiple articles on a particular topic and produce a concise, on-point summary. Your task is to extract the most important details and insights while filtering out any irrelevant or redundant information.
                     Instructions:

Input:

You will receive several articles or text excerpts on a specific topic.

The topic will be clearly stated at the beginning of the input.

Task:

Read and analyze all the provided articles.

Identify the central theme, key points, and critical arguments.

Distill this information into a coherent, concise summary.

Summary Requirements:

Relevance: Include only the information that directly relates to the main topic.

Clarity: Ensure that the summary is easy to understand and logically structured.

Conciseness: Avoid unnecessary details, repetitions, and tangential information.

Focus: Emphasize the most important facts, arguments, or insights from the articles.

Neutral Tone: Present the summary objectively without personal opinions or biases.

Formatting Guidelines:

Begin the summary with a brief introductory sentence that outlines the main topic.

Make sure that the summary feels natural, and make sure  it flows smoothly from one point to the next.

If needed, break the summary into short paragraphs or bullet points to enhance clarity.

Ensure the summary is self-contained and can be understood without referencing the original articles.

Example:

Input Topic: Advances in Renewable Energy

Articles Provided: Several articles discussing recent breakthroughs in solar panel technology, wind turbine efficiency improvements, and government policies supporting renewable energy.

Expected Summary:

Recent developments in renewable energy have been marked by significant breakthroughs in solar panel technology and wind turbine efficiency. Innovations in photovoltaic materials have increased energy capture rates, while new turbine designs have reduced maintenance costs and improved performance. Additionally, supportive government policies are accelerating the transition towards sustainable energy sources, promising long-term environmental and economic benefits.

Edge Cases:

If the provided articles contain conflicting viewpoints, briefly note the discrepancies without taking sides.

If the input contains irrelevant or off-topic sections, disregard these sections entirely.

Final Note:
Your goal is to provide a clear, concise summary that captures the essence of the input articles without deviating into irrelevant details. Focus on the core message and the most impactful points that the articles convey."""
    
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
    response = client.chat.completions.create(
        messages=messages,
        model=model_name,
    )
    
    print(response.choices[0].message.content)
    return response.choices[0].message.content

def fetch_articles_and_domain():
    # Connect to MongoDB using the provided connection string
    mongo_uri = "mongodb+srv://KushalBang:Kushal456@cluster0.8ygxent.mongodb.net/runtimeterrors"
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