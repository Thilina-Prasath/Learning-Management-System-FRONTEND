import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  X,
  BookOpen,
  Upload,
  Camera,
  FileText,
  PaperclipIcon,
  Trash2,
  MessageSquare, // Keep for new button
  Edit2, // Added for the Edit button icon
} from "lucide-react";

const API_URL = "http://localhost:5000/api"; // backend URL

const CourseAdminPanel = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdfs, setUploadingPdfs] = useState(false);
  const [newMaterialTopic, setNewMaterialTopic] = useState("");
  const [newMaterialPdf, setNewMaterialPdf] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    level: "Beginner",
    category: "",
    instructor: "",
    price: "",
    imageUrl: "",
    assignment: "",
    materials: [],
  });

  // Role check
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/");
    } else {
      loadCourses();
    }
  }, [navigate]);

  // Load courses
  const loadCourses = async () => {
    try {
      // ✅ FIX: Call the new protected admin route
      const res = await fetch(`${API_URL}/course/admin/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // If the token is bad, this will fail with a 401
      if (!res.ok) {
        // This will trigger your app's logout/redirect logic
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setCourses(data || []);

    } catch (error) {
      console.error("Error loading courses:", error.message);
    }
  };


  // Select image
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Only images allowed");
    if (file.size > 5 * 1024 * 1024) return alert("Image must be < 5MB");

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  // Upload image to backend
  const uploadImageToBackend = async () => {
    if (!imageFile) return formData.imageUrl;

    const fd = new FormData();
    fd.append("image", imageFile);

    try {
      setUploadingImage(true);
      const res = await fetch(`${API_URL}/course-images`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: fd,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${res.status} - ${errorText}`);
      }
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data.imageUrl;
    } catch (error) {
      console.error("Image upload error:", error);
      throw new Error("Failed to upload image: " + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const uploadMaterialPdf = async (file) => {
    if (!file) return null;

    const fd = new FormData();
    fd.append("pdf", file);

    try {
      const res = await fetch(`${API_URL}/course-pdfs`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: fd,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `PDF upload failed for ${file.name}: ${res.status} - ${errorText}`
        );
      }
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data.pdfUrl;
    } catch (error) {
      console.error("PDF upload error:", error);
      throw new Error("Failed to upload PDF: " + error.message);
    }
  };

  const handleNewPdfSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") return alert("Only PDF files allowed");
    if (file.size > 10 * 1024 * 1024) return alert("PDF must be < 10MB");
    setNewMaterialPdf(file);
  };

  const handleAddNewMaterial = () => {
    if (!newMaterialTopic.trim()) return alert("Please enter a topic name.");
    if (!newMaterialPdf) return alert("Please select a PDF file.");

    const newMaterial = {
      id: Date.now(),
      topic: newMaterialTopic.trim(),
      file: newMaterialPdf,
      pdfUrl: null,
    };

    setFormData({
      ...formData,
      materials: [...formData.materials, newMaterial],
    });

    setNewMaterialTopic("");
    setNewMaterialPdf(null);
    const fileInput = document.getElementById("new-pdf-input");
    if (fileInput) fileInput.value = "";
  };

  const handleRemoveMaterial = (idToRemove) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((m) => m.id !== idToRemove),
    });
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) return alert("Please enter a course title");
    if (!formData.description.trim())
      return alert("Please enter a course description");
    if (!formData.instructor.trim())
      return alert("Please enter an instructor name");
    if (!formData.category.trim()) return alert("Please enter a category");

    setIsLoading(true);
    try {
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImageToBackend();
      }

      setUploadingPdfs(true);

      const materialPromises = formData.materials.map(async (material) => {
        if (material.file) {
          const newPdfUrl = await uploadMaterialPdf(material.file);
          return { topic: material.topic, pdfUrl: newPdfUrl };
        } else {
          return { topic: material.topic, pdfUrl: material.pdfUrl };
        }
      });

      const finalMaterials = await Promise.all(materialPromises);
      setUploadingPdfs(false);

      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        duration: formData.duration.trim(),
        level: formData.level,
        category: formData.category.trim(),
        instructor: formData.instructor.trim(),
        price: formData.price ? parseFloat(formData.price) : 0,
        imageUrl: imageUrl,
        assignment: formData.assignment.trim(),
        materials: finalMaterials,
      };

      if (editingCourse) {
        courseData.id = editingCourse._id;
      }

      const method = editingCourse ? "PUT" : "POST";
      const url = editingCourse
        ? `${API_URL}/course/update/${editingCourse._id}`
        : `${API_URL}/course/save`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(courseData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || errorData.error || `Server error: ${res.status}`
        );
      }
      const result = await res.json();
      if (result.error) throw new Error(result.error);

      await loadCourses();
      resetForm();
      setShowForm(false);
      alert(
        editingCourse
          ? "Course updated successfully!"
          : "Course created successfully!"
      );
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error: " + err.message);
      setUploadingPdfs(false);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    // ... (This function is unchanged)
    if (!window.confirm("Delete course?")) return;
    try {
      const res = await fetch(`${API_URL}/course/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || errorData.error || "Failed to delete"
        );
      }

      await loadCourses();
      alert("Course deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error: " + err.message);
    }
  };


  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      duration: "",
      level: "Beginner",
      category: "",
      instructor: "",
      price: "",
      imageUrl: "",
      assignment: "",
      materials: [],
    });
    setImageFile(null);
    setImagePreview("");
    setEditingCourse(null);
    setNewMaterialTopic("");
    setNewMaterialPdf(null);
    const fileInput = document.getElementById("new-pdf-input");
    if (fileInput) fileInput.value = "";
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData({ ...formData, imageUrl: "" });
  };

  const handleEdit = (course) => {
    setFormData({
      title: course.title || "",
      description: course.description || "",
      duration: course.duration || "",
      level: course.level || "Beginner",
      category: course.category || "",
      instructor: course.instructor || "",
      price: course.price?.toString() || "",
      imageUrl: course.imageUrl || "",
      assignment: course.assignment || "",
      materials:
        course.materials?.map((m, index) => ({
          id: index,
          topic: m.topic,
          pdfUrl: m.pdfUrl,
          file: null,
        })) || [],
    });
    setImagePreview(course.imageUrl || "");
    setImageFile(null);
    setEditingCourse(course);
    setShowForm(true);
    setNewMaterialTopic("");
    setNewMaterialPdf(null);
    const fileInput = document.getElementById("new-pdf-input");
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow mb-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BookOpen className="text-blue-600 h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Course Admin Panel</h1>
              <p className="text-gray-500">Manage your courses</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              Total: <span className="font-semibold">{courses.length}</span>
            </span>

            <button
              onClick={() => navigate("/admin/reviews")} 
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" /> Manage Reviews
            </button>

            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Course
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            {/* ... (The entire form is unchanged) ... */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingCourse ? "Edit Course" : "Add New Course"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter course title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Course description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignment Description
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Assignment instructions or description"
                    value={formData.assignment}
                    onChange={(e) =>
                      setFormData({ ...formData, assignment: e.target.value })
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instructor *
                    </label>
                    <input
                      type="text"
                      placeholder="Instructor name"
                      value={formData.instructor}
                      onChange={(e) =>
                        setFormData({ ...formData, instructor: e.target.value })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Programming"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 8 weeks"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) =>
                        setFormData({ ...formData, level: e.target.value })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - File Uploads */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Image
                  </label>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Course preview"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 text-sm mb-2">
                        Upload course image
                      </p>
                      <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded text-sm inline-flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Choose Image
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageSelect}
                        />
                      </label>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Materials (Topics & PDFs)
                  </label>

                  <div className="space-y-2 mb-3">
                    {formData.materials.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-2">
                        No materials added yet.
                      </p>
                    )}
                    {formData.materials.map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />
                          <div className="overflow-hidden">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {material.topic}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {material.file
                                ? material.file.name
                                : "Previously uploaded PDF"}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(material.id)}
                          className="text-red-500 hover:text-red-700 flex-shrink-0 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <h4 className="text-sm font-medium text-gray-700">
                      Add New Material
                    </h4>
                    <div>
                      <label
                        htmlFor="new-topic-input"
                        className="block text-xs font-medium text-gray-600 mb-1"
                      >
                        Topic Name
                      </label>
                      <input
                        type="text"
                        id="new-topic-input"
                        placeholder="e.g., Chapter 1: Introduction"
                        value={newMaterialTopic}
                        onChange={(e) => setNewMaterialTopic(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="new-pdf-input"
                        className="block text-xs font-medium text-gray-600 mb-1"
                      >
                        PDF File
                      </label>
                      <input
                        type="file"
                        id="new-pdf-input"
                        accept=".pdf"
                        onChange={handleNewPdfSelect}
                        className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddNewMaterial}
                      className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" /> Add Material
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading || uploadingImage || uploadingPdfs}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg flex items-center gap-2"
              >
                {uploadingImage ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Uploading Image...
                  </>
                ) : uploadingPdfs ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Uploading PDFs...
                  </>
                ) : isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Saving Course...
                  </>
                ) : editingCourse ? (
                  "Update Course"
                ) : (
                  "Create Course"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Courses List */}
        {/* ✅ This section will only show if the form AND the (now removed) review modal are hidden */}
        {!showForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* ... (Course Image) ... */}
                <div className="aspect-video bg-gray-100">
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full bg-gray-200 items-center justify-center ${
                      course.imageUrl ? "hidden" : "flex"
                    }`}
                  >
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-4">
                  {/* ... (Course title, level, description, etc.) ... */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {course.title}
                    </h3>
                    {course.level && (
                      <span
                        className={`px-2 py-1 text-xs rounded-full ml-2 flex-shrink-0 ${
                          course.level === "Beginner"
                            ? "bg-green-100 text-green-800"
                            : course.level === "Intermediate"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {course.level}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="space-y-1 mb-4">
                    {course.instructor && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Instructor:</span>{" "}
                        {course.instructor}
                      </p>
                    )}
                    {course.duration && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Duration:</span>{" "}
                        {course.duration}
                      </p>
                    )}
                    {course.category && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Category:</span>{" "}
                        {course.category}
                      </p>
                    )}
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-lg font-bold text-blue-600">
                        {course.price > 0 ? `$${course.price}` : "Free"}
                      </span>
                      <div className="flex items-center gap-2">
                        {course.materials && course.materials.length > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {course.materials.length}{" "}
                            {course.materials.length > 1
                              ? "Materials"
                              : "Material"}
                          </span>
                        )}

                        {course.assignment && (
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded flex items-center gap-1">
                            <PaperclipIcon className="h-3 w-3" />
                            Assignment
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ✅ MODIFIED Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                    {/* --- REMOVED REVIEWS BUTTON --- */}
                    <button
                      onClick={() => deleteCourse(course._id)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* No courses message */}
            {courses.length === 0 && (
              <div className="col-span-full text-center py-12">
                {/* ... (unchanged) ... */}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseAdminPanel;