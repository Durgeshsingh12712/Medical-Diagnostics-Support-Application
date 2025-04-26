from euriai.langchain_llm import EuriaiLangChainLLM
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from config import Config

class LLMService:
    def __init__(self, vector_store):
        self.llm = EuriaiLangChainLLM(
            temperature=0.7,
            model="gpt-4.1-nano",
            api_key = Config.EURIAI_API_KEY
        )
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        self.chain = ConversationalRetrievalChain.from_llm(
            llm = self.llm,
            retriever = vector_store.vector_store.as_retriever(),
            memory = self.memory
        )
    
    def get_response(self, query):
        try:
            response = self.chain({"question": query})
            return response['answer']
        except Exception as e:
            print(f"Error Getting LLM Response: {e}")
            return "I encountered an error processing your request."