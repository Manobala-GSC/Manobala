import React from 'react';
import Navbar from '../components/Navbar';
import { FiDownload, FiPrinter } from 'react-icons/fi';

function Resources() {
  const resources = [
    {
      category: "Emergency Action Plans",
      items: [
        {
          title: "Personal Safety Plan",
          description: "A customizable plan for individuals at risk",
          downloadUrl: "/resources/safety-plan.pdf",
          type: "PDF"
        },
        {
          title: "Emergency Contact Sheet",
          description: "Template for important contacts and emergency numbers",
          downloadUrl: "/resources/emergency-contacts.pdf",
          type: "PDF"
        }
      ]
    },
    {
      category: "Discussion Guides",
      items: [
        {
          title: "Parent-Child Safety Talk Guide",
          description: "Age-appropriate conversation starters about personal safety",
          downloadUrl: "/resources/safety-talk.pdf",
          type: "PDF"
        },
        {
          title: "Workplace Harassment Discussion Points",
          description: "Guidelines for addressing workplace abuse",
          downloadUrl: "/resources/workplace-guide.pdf",
          type: "PDF"
        }
      ]
    },
    {
      category: "Educational Materials",
      items: [
        {
          title: "Trusted Adults Chart",
          description: "Visual guide for identifying safe adults",
          downloadUrl: "/resources/trusted-adults.pdf",
          type: "PDF"
        },
        {
          title: "Personal Boundaries Worksheet",
          description: "Interactive worksheet for understanding boundaries",
          downloadUrl: "/resources/boundaries.pdf",
          type: "PDF"
        }
      ]
    }
  ];

  const handleDownload = (url, title) => {
    // In a real application, you would handle the actual file download here
    toast.info(`Downloading ${title}...`);
  };

  const handlePrint = (url, title) => {
    // In a real application, you would handle the printing logic here
    toast.info(`Preparing ${title} for printing...`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Resources & Printable Guides</h1>
        
        {/* Resource Categories */}
        {resources.map((category, index) => (
          <div key={index} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">{category.category}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-700">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleDownload(item.downloadUrl, item.title)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <FiDownload /> Download
                    </button>
                    <button
                      onClick={() => handlePrint(item.downloadUrl, item.title)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FiPrinter /> Print
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Format: {item.type}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Usage Guidelines */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mt-8">
          <h3 className="text-xl font-semibold mb-2 text-blue-700">Usage Guidelines</h3>
          <ul className="list-disc list-inside text-blue-600 space-y-2">
            <li>All resources are free for personal and educational use</li>
            <li>Please do not modify or redistribute without permission</li>
            <li>For organizational use, please contact us for permission</li>
            <li>Resources are regularly updated - check back for the latest versions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Resources; 