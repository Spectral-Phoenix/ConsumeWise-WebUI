import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";

const ProductInfoBentoGrid = ({ productData, isDarkMode, isLoadingAnalysis, analysisData }) => {
  const {
    product_name,
    product_image_url,
    product_details,
    claims,
    ingredients,
    nutritional_information
  } = productData;

  // Parse nutritional information
  const parsedNutritionalInfo = nutritional_information
    .split(",")
    .map(item => item.trim())
    .reduce((acc, item) => {
      let name = "";
      let value = "";
      let unit = "";

      const firstNumberIndex = item.search(/\d/);

      if (firstNumberIndex !== -1) {
        name = item.substring(0, firstNumberIndex).trim(); // Extract name
        const remaining = item.substring(firstNumberIndex).trim();
        const parts = remaining.split(" ");
        value = parts[0]; // Extract the number as value
        unit = parts.slice(1).join(" "); // Extract the rest as unit
      }

      if (name && value) {
        acc[name] = { value, unit };
      }

      return acc;
    }, {});

  const parsedClaims = claims.split(',').map(claim => claim.trim());

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center">{product_name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Product Image */}
        <Card className={`md:col-span-1 row-span-2 ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100'}`}> 
          <CardContent className="p-4">
            <img src={product_image_url} alt={product_name} className="w-full h-auto object-cover rounded-lg" />
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card className={isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100'}> 
          <CardHeader>
            <CardTitle className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : ''}`}>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm md:text-base"><strong>Brand:</strong> {product_details.brand_name}</p>
            <p className="text-sm md:text-base"><strong>Category:</strong> {product_details.category.purpose}</p>
            <p className="text-sm md:text-base"><strong>Frequency:</strong> {product_details.category.frequency}</p>
            <p className="text-sm md:text-base"><strong>Weight:</strong> {product_details.weight}</p>
          </CardContent>
        </Card>

        {/* Analysis */}
        <Card className={`md:col-span-1 row-span-2 ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100'}`}>
          <CardHeader>
            <CardTitle className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : ''}`}>Analysis</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center"> 
            {analysisData && analysisData.map((point, index) => (
              <ReactMarkdown key={index} className={`text-sm md:text-base ${isDarkMode ? 'text-gray-100' : ''}`}>
                {point} 
              </ReactMarkdown>
            ))}
            {!analysisData && isLoadingAnalysis && <Loader />}
            {!analysisData && !isLoadingAnalysis && <p>No analysis data available.</p>}
          </CardContent>
        </Card>

        {/* Product Claims */}
        <Card className={isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100'}>
          <CardHeader>
            <CardTitle className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : ''}`}>Product Claims</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {parsedClaims.map((claim, index) => (
              <Badge key={index} variant="outline" className={`text-base ${isDarkMode ? 'border-gray-400 text-gray-100' : 'border-gray-400 text-gray-800'}`}> 
                {claim}
              </Badge>
            ))}
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card className={`md:col-span-1 row-span-2 ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100'}`}>
          <CardHeader>
            <CardTitle className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : ''}`}>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm md:text-base">
              {ingredients.split(",").map((ingredient, index) => (
                <li key={index}>{ingredient.trim()}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Nutritional Information */}
        <Card className={`md:col-span-2 row-span-2 ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100'}`}> 
          <CardHeader>
            <CardTitle className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : ''}`}>Nutritional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4"> 
              {Object.entries(parsedNutritionalInfo).map(([name, { value, unit }]) => (
                <div key={name} className={`bg-gray-200 p-2 rounded-lg text-sm md:text-base ${isDarkMode ? 'bg-gray-700' : ''}`}>
                  <p className="font-semibold">{name}</p>
                  <p className="font-bold text-lg">{value} <span className="text-sm font-normal">{unit}</span></p> 
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


const ConversationPage = ({ isDarkMode, transition }) => {
  const location = useLocation();
  const { productData } = location.state || {};
  const [message, setMessage] = useState("");
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);
  const chatContainerRef = useRef(null);

  // State for analysis data and loading
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  const userData = JSON.parse(localStorage.getItem("userData"));

  const analysisRequested = useRef(false); 

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (productData && userData && !analysisRequested.current) {
        analysisRequested.current = true;
        setIsLoadingAnalysis(true);
        try {
          const combinedData = {
            productData,
            userData,
          };

          const response = await fetch("https://translation-periodically-surveys-ratings.trycloudflare.com/analysis", {
            method: "POST",
            headers: {
              "Content-Type": "text/plain",
            },
            body: JSON.stringify(combinedData),
          });

          if (response.ok) {
            console.log("Response Received");
            const data = await response.json();
            setAnalysisData(data.analysis);
            console.log("Analysis Data:", data.analysis);
          } else {
            console.error("Error fetching analysis:", response.status);
          }
        } catch (error) {
          console.error("Error fetching analysis:", error);
        } finally {
          setIsLoadingAnalysis(false);
        }
      }
    };
    fetchAnalysis();
  }, [productData, userData]);


  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && message.trim() !== "") {
      e.preventDefault();
      const newMessage = { type: "user", content: message };
      setConversations([...conversations, newMessage]);
      simulateAIResponse(newMessage);
      setMessage("");
      setIsFirstOpen(false);
      if (!hasSentFirstMessage) {
        setHasSentFirstMessage(true);
      }
    }
  };

  const simulateAIResponse = (userMessage) => {
    setTimeout(() => {
      const aiResponse = {
        type: "ai",
        content: `Response to: ${userMessage.content}`,
      };
      setConversations((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
    return () => {
      document.body.classList.remove("dark");
    };
  }, [isDarkMode]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversations]);

  const chatVariants = {
    closed: { height: "64px", opacity: 0.9 },
    open: { height: "80vh", opacity: 1 },
  };

  const handleChatAreaClick = (e) => {
    e.stopPropagation();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={transition}
      className={`flex flex-col min-h-screen p-8 pl-24 relative transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800" 
      }`}
    >
      <div className="flex-grow mb-20 overflow-y-auto" style={{ maxHeight: "calc(100vh - 128px)" }}>
        {productData && <ProductInfoBentoGrid productData={productData} isDarkMode={isDarkMode} analysisData={analysisData} isLoadingAnalysis={isLoadingAnalysis}/>}
      </div>

      {/* Conversation Area */}
      <motion.div
        className="w-full max-w-3xl mx-auto fixed inset-x-0 bottom-0 z-50 flex justify-center"
        initial="closed"
        animate={isChatExpanded ? "open" : "closed"}
        variants={chatVariants}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        onClick={handleChatAreaClick}
      >
        <motion.div
          className={`w-full rounded-t-xl shadow-lg overflow-hidden transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-800 text-gray-100 shadow-gray-900"
              : "bg-gray-100 text-gray-800 shadow-gray-300" 
          }`}
          style={{
            border: isDarkMode ? "1px solid #4a5568" : "1px solid #e2e8f0",
          }}
        >
          {/* Header Section */}
          {hasSentFirstMessage && isChatExpanded && (
            <div
              className={`relative flex items-center justify-center p-4 border-b ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h3 className="text-lg font-medium">Assistant</h3>
              <button
                onClick={() => setIsChatExpanded(false)}
                className={`absolute right-4 text-xl transition-colors duration-300 ${
                  isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                ×
              </button>
            </div>
          )}

          <AnimatePresence>
            {isChatExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                ref={chatContainerRef}
                className="p-4 overflow-y-auto flex flex-col"
                style={{
                  height: hasSentFirstMessage ? "calc(80vh - 128px)" : "calc(80vh - 64px)",
                  maxHeight: hasSentFirstMessage ? "calc(80vh - 128px)" : "calc(80vh - 64px)",
                }}
              >
                {isFirstOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center flex-grow"
                  >
                    <img
                      src="https://via.placeholder.com/150"
                      alt="Assistant Profile"
                      className="w-24 h-24 rounded-full mb-4 shadow-lg"
                    />
                    <h3 className="text-xl font-medium mb-2 text-center">Welcome to the Assistant</h3>
                    <p className="text-sm text-center mb-4">
                      I'm here to help you with any questions related to the product. Feel free to ask
                      anything!
                    </p>
                  </motion.div>
                )}
                {conversations.map((conv, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-4 ${conv.type === "user" ? "text-right" : "text-left"}`}
                  >
                    <div
                      className={`inline-block px-4 py-2 rounded-lg ${
                        conv.type === "user"
                          ? "bg-[#e0efff] text-gray-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <strong>{conv.type === "ai" ? "AI: " : "You: "}</strong>
                      {conv.content}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="p-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsChatExpanded(true)}
              placeholder="Ask any question related to the product..."
              className={`w-full px-4 py-2 rounded-md resize-none focus:outline-none transition-colors duration-300 ${
                isDarkMode
                  ? "bg-gray-800 text-gray-200 placeholder-gray-400"
                  : "bg-gray-100 text-gray-800 placeholder-gray-500" 
              }`}
              style={{
                minHeight: "48px",
                maxHeight: "120px",
                border: "none",
              }}
              aria-label="Ask any question related to the case"
              aria-multiline="true"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Full-screen Background Blur */}
      <AnimatePresence>
        {isChatExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            onClick={() => setIsChatExpanded(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ConversationPage;