import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InspectionAdmin.css";

const InspectionAdmin = () => {
  const [open, setOpen] = useState(null);
  const [mainImage, setMainImage] = useState(0);
  const navigate = useNavigate();

  const [generalRating, setGeneralRating] = useState(7);
  const [conditionSummary, setConditionSummary] = useState("Good");
  const [exteriorNotes, setExteriorNotes] = useState("");
  const [interiorNotes, setInteriorNotes] = useState("");
  const [finalNotes, setFinalNotes] = useState("");
  const [files, setFiles] = useState([]);

  const toggle = (index) => setOpen(open === index ? null : index);

  const images = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs9aiIdnu7FwBk8z2OuOvu1jI7ntYTDdjldQ&s",
    "https://www.dubicars.com/images/31937b/w_1300x760/target-motors-fze/781e24ac-e639-41e1-8947-a1baa1cdbf8b.jpg",
    "https://i.ytimg.com/vi/oECQIz0u4m8/hqdefault.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-ZmZbDfvfebT0of5BybJVk0S7KpOGTuSikA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2NfOVBW4HGBMkdqh1uhLity0Rah6pGH8icw&s"
  ];

  const handleApprove = () => {
    const dataToSave = {
      generalRating,
      conditionSummary,
      exteriorNotes,
      interiorNotes,
      finalNotes,
      files: Array.from(files).map(file => file.name)
    };

    localStorage.setItem("inspectionData", JSON.stringify(dataToSave));
    alert("Inspection data saved to localStorage!");
    navigate("/admin-panel");
  };

  const handleReject = () => navigate("/admin-panel");

  return (
    <div className="inspection-container">
      <div className="left-section">
        <h1 className="page-title">Inspection Reviews</h1>

        <div className="top-image-card">
          <img src={images[1]} className="top-single-image" alt="vehicle" />
          <div className="top-image-details">
            <h4 className="car-title1">2018 Toyota Hilux</h4>
            <p className="car-meta1">Item ID: GHI789</p>
            <p className="car-meta1">Category: Vehicles</p>
          </div>
        </div>

        <div className="accordion-box custom-grid">

          {/* Row 1 */}
          <div className="grid-row">
            <div className="accordion-item">
              <div className="accordion-header" onClick={() => toggle(1)}>
                <span>General Condition</span>
                <span>{open === 1 ? "▲" : "▼"}</span>
              </div>
              {open === 1 && (
                <div className="accordion-body">
                  <label className="label-text">
                    Overall Rating: {generalRating}/10
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min={0}
                    max={10}
                    value={generalRating}
                    onChange={(e) => setGeneralRating(Number(e.target.value))}
                  />
                </div>
              )}
            </div>

            <div className="accordion-item">
              <div className="accordion-header" onClick={() => toggle(2)}>
                <span>Exterior / Cosmetic</span>
                <span>{open === 2 ? "▲" : "▼"}</span>
              </div>
              {open === 2 && (
                <div className="accordion-body">
                  <textarea
                    className="form-control dark-input"
                    rows="3"
                    placeholder="Exterior notes"
                    value={exteriorNotes}
                    onChange={(e) => setExteriorNotes(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid-row">
            <div className="accordion-item">
              <div className="accordion-header" onClick={() => toggle(3)}>
                <span>Interior / Mechanical</span>
                <span>{open === 3 ? "▲" : "▼"}</span>
              </div>
              {open === 3 && (
                <div className="accordion-body">
                  <textarea
                    className="form-control dark-input"
                    rows="3"
                    placeholder="Interior notes"
                    value={interiorNotes}
                    onChange={(e) => setInteriorNotes(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="accordion-item">
              <div className="accordion-header" onClick={() => toggle(4)}>
                <span>Documentation & Attachments</span>
                <span>{open === 4 ? "▲" : "▼"}</span>
              </div>
              {open === 4 && (
                <div className="accordion-body">
                  <input
                    type="file"
                    className="form-control dark-input"
                    multiple
                    onChange={(e) => setFiles(e.target.files)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid-row full-width-row">
            <div className="accordion-item">
              <div className="accordion-header" onClick={() => toggle(5)}>
                <span>Final Notes</span>
                <span>{open === 5 ? "▲" : "▼"}</span>
              </div>
              {open === 5 && (
                <div className="accordion-body">
                  <textarea
                    className="form-control dark-input"
                    rows="2"
                    placeholder="Final notes"
                    value={finalNotes}
                    onChange={(e) => setFinalNotes(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <div className="right-section">
        <div className="image-card">
          <img src={images[mainImage]} className="big-image" alt="vehicle" />
          <div className="thumbnail-row">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                className={`thumb-img ${mainImage === index ? "active-thumb" : ""}`}
                onClick={() => setMainImage(index)}
                alt="thumb"
              />
            ))}
          </div>
          <h4 className="car-title">2018 Toyota Hilux</h4>
          <p className="car-meta">Item ID: GHI789</p>
          <p className="car-meta">Category: Vehicles</p>
        </div>

        <button className="btn btn-success approve-btn" onClick={handleApprove}>
          Approve
        </button>
        <button className="btn btn-danger reject-btn" onClick={handleReject}>
          Reject
        </button>
      </div>
    </div>
  );
};

export default InspectionAdmin;
