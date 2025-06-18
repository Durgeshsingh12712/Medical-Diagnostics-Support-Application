# Medical-Diagnostics-Support-Application

# Env Python 3.12

![My Image](https://github.com/Durgeshsingh12712/Data-All/blob/main/Med%20Diago/1.webpage.jpeg)
![My Image](https://github.com/Durgeshsingh12712/Data-All/blob/main/Med%20Diago/2.upload_ask_response.jpeg)
![My Image](https://github.com/Durgeshsingh12712/Data-All/blob/main/Med%20Diago/3.%20S3%20Bucket%20File.png)

# RAG System with Vector Store and LLM

A Retrieval-Augmented Generation (RAG) system that combines vector-based document retrieval with Large Language Model capabilities for intelligent question answering.

## Features

- **Vector-based Document Storage**: Uses ChromaDB for efficient document embedding and retrieval
- **Advanced Language Model**: Integrates with Groq's Llama model for natural language processing
- **Conversational Memory**: Maintains chat history for context-aware responses
- **Cloud Storage**: AWS S3 integration for file storage and management
- **Similarity Search**: Find relevant documents based on semantic similarity

## Architecture

### VectorStore Class
- **Purpose**: Manages document embeddings and similarity search
- **Embedding Model**: HuggingFace embeddings for text vectorization
- **Storage**: ChromaDB with persistent storage
- **Key Methods**:
  - `add_documents()`: Store new documents in the vector database
  - `similarity_search()`: Retrieve similar documents based on query

### LLMService Class
- **Purpose**: Handles conversational AI interactions
- **Model**: Meta-Llama/Llama-4-Maverick-17B model via Groq
- **Memory**: Conversation buffer for maintaining chat context
- **Chain**: ConversationalRetrievalChain for RAG functionality
- **Key Methods**:
  - `get_response()`: Process queries and return AI-generated responses

### S3Storage Class
- **Purpose**: Cloud-based file storage and retrieval
- **Service**: AWS S3 integration
- **Key Methods**:
  - `upload_file()`: Store files in S3 bucket
  - `get_file()`: Retrieve files from S3 bucket

## Prerequisites

- Python 3.8+
- AWS Account with S3 access
- Groq API key
- Required Python packages (see Installation)

## Installation

```bash
pip install chromadb
pip install langchain
pip install langchain-community
pip install langchain-groq
pip install boto3
pip install sentence-transformers
```

## Configuration

Create a `config.py` file with the following variables:

```python
class Config:
    GROQ_API_KEY = "your_groq_api_key"
    AWS_ACCESS_KEY = "your_aws_access_key"
    AWS_SECRET_KEY = "your_aws_secret_key"
    AWS_BUCKET_NAME = "your_s3_bucket_name"
```

## Usage

### Initialize the System

```python
from vector_store import VectorStore
from llm_service import LLMService
from s3_storage import S3Storage

# Initialize components
vector_store = VectorStore("./chroma_db")
llm_service = LLMService(vector_store)
s3_storage = S3Storage()
```

### Add Documents

```python
# Add documents to vector store
documents = [...]  # Your document objects
vector_store.add_documents(documents)
```

### Query the System

```python
# Get AI response based on document context
response = llm_service.get_response("Your question here")
print(response)
```

### File Storage

```python
# Upload file to S3
with open("file.txt", "rb") as f:
    s3_storage.upload_file(f, "file.txt")

# Retrieve file from S3
file_content = s3_storage.get_file("file.txt")
```

## Key Components

- **ChromaDB**: Vector database for document embeddings
- **HuggingFace Embeddings**: Text-to-vector transformation
- **Groq LLM**: Advanced language model for response generation
- **LangChain**: Framework for building LLM applications
- **AWS S3**: Cloud storage for file management

## Error Handling

The system includes comprehensive error handling:
- LLM service errors return user-friendly messages
- S3 operations handle ClientError exceptions
- Graceful degradation for service failures

## Model Configuration

- **Temperature**: 0.7 (balanced creativity and consistency)
- **Model**: meta-llama/llama-4-maverick-17b-128e-instruct
- **Retrieval**: Top-k similarity search (default k=4)
- **Memory**: Full conversation history retention

## Security Considerations

- Store API keys and credentials securely
- Use environment variables for sensitive configuration
- Implement proper IAM roles for AWS access
- Consider encryption for sensitive documents

## Troubleshooting

- Ensure all API keys are valid and have proper permissions
- Check network connectivity for cloud services
- Verify ChromaDB persistence directory permissions
- Monitor API usage limits and quotas