import React from 'react'
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../api/axios";
const ApplyForExpo = () => {
  const { eventId } = useParams();

  const [applicationData, setApplicationData] = useState({
    companyName: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setApplicationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventId) {
      toast.error("Event ID is missing");
      return;
    }

    if (!applicationData.companyName.trim()) {
      toast.error("Company name is required");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await api.post(
        `/exhibitor/${eventId}/applications`,
        {
          companyName: applicationData.companyName.trim(),
          description: applicationData.description.trim(),
        }
      );

      toast.success(response.data.message);

      setApplicationData({
        companyName: "",
        description: "",
      });

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Application submission failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Apply for Expo</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="companyName">
            Company Name
          </label>

          <input
            type="text"
            id="companyName"
            name="companyName"
            value={applicationData.companyName}
            onChange={handleChange}
            placeholder="Enter Company Name"
            required
          />
        </div>

        <div>
          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={applicationData.description}
            onChange={handleChange}
            placeholder="Describe your company"
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default ApplyForExpo