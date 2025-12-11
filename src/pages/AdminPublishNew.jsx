import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPublishNew.css"; 

const AdminPublishNew = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    lotNumber: "",
    startingBid: "",
    description: "",
    auction: "",
    reservePrice: false,
    images: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (files) => {
    const fileArray = Array.from(files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...fileArray],
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleImageUpload(e.dataTransfer.files);
  };

  const handleSaveDraft = () => {
    localStorage.setItem("draftLot", JSON.stringify(formData));
    navigate("/auctiontab");
  };

  const handlePublish = () => {
    localStorage.setItem("publishedLot", JSON.stringify(formData));
    navigate("/auctiontab");
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2 className="header-title">Publish New Lot</h2>
        <button className="btn-draft" onClick={handleSaveDraft}>
          Save Draft
        </button>
      </div>

      <div className="row g-4">
        <div className="col-md-7">
          <div className="admin-card">
            <h5 className="card-title-custom">Lot Details</h5>

            <div className="mb-3">
              <label className="form-label-custom">Lot Title</label>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                placeholder="Enter title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="row mb-3">
              <div className="col">
                <label className="form-label-custom">Lot Number</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="e.g. L-1024"
                  name="lotNumber"
                  value={formData.lotNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="col">
                <label className="form-label-custom">Starting Bid ($)</label>
                <input
                  type="number"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="500.00"
                  name="startingBid"
                  value={formData.startingBid}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label-custom">Lot Description</label>
              <textarea
                rows={4}
                className="form-control bg-dark text-white border-secondary"
                placeholder="Description..."
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label-custom">Assign Auction</label>
              <select
                className="form-select bg-dark text-white border-secondary"
                name="auction"
                value={formData.auction}
                onChange={handleChange}
              >
                <option value="">Select Auction</option>
                <option value="Auction 1">Auction 1</option>
                <option value="Auction 2">Auction 2</option>
              </select>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <span className="form-label-custom">Set Reserve Price</span>
              <div className="form-check form-switch">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="reservePrice"
                  checked={formData.reservePrice}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="admin-card">
            <h5 className="card-title-custom">Images</h5>

            <div
              className="drop-area"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <p className="drop-area-text">
                Drag & Drop Images Here or Click to Upload
              </p>
              <input
                type="file"
                id="fileInput"
                multiple
                hidden
                onChange={(e) => handleImageUpload(e.target.files)}
              />
            </div>

            <div className="d-flex flex-wrap gap-2 mt-3">
              {formData.images.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt=""
                  className="preview-img"
                />
              ))}
            </div>
          </div>

          <div className="admin-card">
            <h5 className="card-title-custom">Publishing</h5>

            <p style={{ color: "#fff" }}>
              Status:{" "}
              <span className="badge bg-warning text-dark">Draft</span>
            </p>

            <button className="btn-publish" onClick={handlePublish}>
              Publish Lot
            </button>

            <button className="btn-preview">Preview Lot</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPublishNew;