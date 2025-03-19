"use client"

import { useState } from "react"
import Navbar from "../components/Navbar"
import { toast } from "react-toastify"

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Here you would typically send the form data to your backend
      toast.success("Message sent successfully! We will get back to you soon.")
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (error) {
      toast.error("Failed to send message. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-light-pink">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-primary">Contact Us</h1>

          {/* Emergency Contact */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg shadow-sm">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Emergency Support</h2>
            <p className="text-red-600">
              If you're in immediate danger, please contact emergency services: <br />
              Emergency Helpline: <strong>911</strong> <br />
              National Abuse Hotline: <strong>1-800-799-SAFE (7233)</strong>
            </p>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6 text-primary">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light transition-all duration-200 h-32 resize-none"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-primary text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity font-medium shadow-md"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
