// HistoryPage.jsx (updated with clear history button)
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "react-feather"; 

const HistoryPage = ({ isDarkMode, transition }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem("productHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const formatDateWithTimezone = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(); 
  };

  const clearHistory = () => {
    localStorage.removeItem("productHistory");
    setHistory([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={transition}
      className={`flex-grow p-8 ml-16 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="flex justify-between items-center mb-6"> 
        <h1 className="text-3xl font-semibold">History</h1>
        <button 
          onClick={clearHistory} 
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800" 
          title="Clear History"
        >
          <Trash2 size={20} className="text-gray-600 dark:text-gray-400" /> 
        </button>
      </div>
      {history.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Date</TableHead> 
              <TableHead className="w-1/3">Conversation ID</TableHead>
              <TableHead className="w-1/3">Product Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {formatDateWithTimezone(item.timestamp)} 
                </TableCell>
                <TableCell>{item.conversationId}</TableCell>
                <TableCell>{item.productName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-center text-gray-600">No history found.</p>
      )}
    </motion.div>
  );
};

export default HistoryPage;