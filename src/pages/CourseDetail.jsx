import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  getCourseById,
  addSection,
  updateSection,
  deleteSection,
  addContent,
  updateContent,
  deleteContent,
  getContentUrl,
  addObjective,
  updateObjective,
  deleteObjective,
} from "../services/course";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import EditCourseModal from "../components/EditCourseModal";
import EditSectionModal from "../components/EditSectionModal";
import EditContentModal from "../components/EditContentModal";
import EditObjectiveModal from "../components/EditObjectiveModal";
import Sidebar from "../components/Sidebar";

export default function CourseDetail() {
  return (
    <div className="flex flex-row w-full">
      <Sidebar />
      <CourseDetailsDiv />
    </div>
  );
}

const CourseDetailsDiv = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [newSection, setNewSection] = useState({ title: "", description: "" });
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    duration: 0,
    file: null,
  });
  const [previewContent, setPreviewContent] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [isEditSectionModalOpen, setIsEditSectionModalOpen] = useState(false);
  const [isEditContentModalOpen, setIsEditContentModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isEditObjectiveModalOpen, setIsEditObjectiveModalOpen] =
    useState(false);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [isAddObjectiveModalOpen, setIsAddObjectiveModalOpen] = useState(false);
  const [newObjective, setNewObjective] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await getCourseById(id);
      if (response.success) {
        setCourse(response.course);
      }
    } catch (error) {
      toast.error("Failed to fetch course details");
      navigate("/courses");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    try {
      const response = await addSection(id, {
        ...newSection,
        order: course.sections.length,
      });
      if (response.success) {
        setCourse(response.course);
        setIsAddSectionModalOpen(false);
        setNewSection({ title: "", description: "" });
        toast.success("Section added successfully");
      }
    } catch (error) {
      toast.error("Failed to add section");
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      try {
        const response = await deleteSection(id, sectionId);
        if (response.success) {
          toast.success("Section deleted successfully");
          window.location.reload();
        }
      } catch (error) {
        toast.error("Failed to delete section");
      }
    }
  };

  const handleAddObjective = async (e) => {
    e.preventDefault();
    try {
      const response = await addObjective(id, {
        ...newObjective,
        // order: course.objectives.length,
      });
      if (response.success) {
        setCourse(response.course);
        setIsAddObjectiveModalOpen(false);
        setNewObjective({ title: "", description: "", order: "" });
        toast.success("Objective added successfully");
      }
    } catch (error) {
      toast.error("Failed to add objective");
    }
  };

  const handleDeleteObjective = async (objectiveId) => {
    if (window.confirm("Are you sure you want to delete this objective?")) {
      try {
        const response = await deleteObjective(id, objectiveId);
        if (response.success) {
          toast.success("Objective deleted successfully");
          window.location.reload();
        }
      } catch (error) {
        toast.error("Failed to delete Objective");
      }
    }
  };

  const handleAddContent = async (e) => {
    e.preventDefault();
    try {
      const selectedSection = course.sections.find(
        (s) => s._id === selectedSectionId
      );
      if (!selectedSection) {
        toast.error("Section not found");
        return;
      }

      // Validate required fields
      if (
        !newContent.title ||
        !newContent.description ||
        !newContent.duration ||
        !newContent.file
      ) {
        toast.error("All fields are required");
        return;
      }

      const formData = new FormData();
      // Required fields
      formData.append("title", newContent.title);
      formData.append("description", newContent.description);
      formData.append("duration", newContent.duration);
      formData.append("sectionId", selectedSectionId);
      formData.append("order", selectedSection.content.length);
      formData.append("file", newContent.file);

      const response = await addContent(id, formData);
      if (response.success) {
        setCourse(response.course);
        setIsAddContentModalOpen(false);
        setNewContent({ title: "", description: "", duration: 0, file: null });
        toast.success("Content added successfully");
      }
    } catch (error) {
      console.error("Error adding content:", error);
      toast.error(error.response?.data?.error || "Failed to add content");
    }
  };

  const handleDeleteContent = async (sectionId, contentId) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      try {
        const response = await deleteContent(id, sectionId, contentId);
        if (response.success) {
          toast.success("Content deleted successfully");
          window.location.reload();
        }
      } catch (error) {
        toast.error("Failed to delete content");
      }
    }
  };

  const handlePreviewContent = async (sectionId, contentId) => {
    try {
      const response = await getContentUrl(id, sectionId, contentId);
      if (response.success) {
        setPreviewContent({
          url: response.url,
          title: course.sections
            .find((s) => s._id === sectionId)
            ?.content.find((c) => c._id === contentId)?.title,
        });
        setIsPreviewModalOpen(true);
      }
    } catch (error) {
      toast.error("Failed to get content URL");
    }
  };

  const handleUpdateContent = async (sectionId, contentId, updatedData) => {
    try {
      const response = await updateContent(
        id,
        sectionId,
        contentId,
        updatedData
      );
      if (response.success) {
        setCourse(response.course);
        toast.success("Content updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update content");
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === "section") {
      const sections = Array.from(course.sections);
      const [removed] = sections.splice(source.index, 1);
      sections.splice(destination.index, 0, removed);

      try {
        const updatePromises = sections.map((section, index) =>
          updateSection(id, section._id, {
            title: section.title,
            description: section.description,
            order: index,
          })
        );

        const responses = await Promise.all(updatePromises);
        if (responses.every((response) => response.success)) {
          setCourse(responses[responses.length - 1].course);
        }
      } catch (error) {
        toast.error("Failed to reorder sections");
      }
    } else if (type === "content") {
      const sourceSection = course.sections.find(
        (s) => s._id === source.droppableId
      );
      const destSection = course.sections.find(
        (s) => s._id === destination.droppableId
      );

      if (!sourceSection || !destSection) {
        toast.error("Invalid section");
        return;
      }

      const sourceContents = Array.from(sourceSection.content);
      const destContents =
        source.droppableId === destination.droppableId
          ? sourceContents
          : Array.from(destSection.content);

      const [removed] = sourceContents.splice(source.index, 1);
      destContents.splice(destination.index, 0, removed);

      try {
        const updatePromises = destContents.map((content, index) =>
          updateContent(id, destination.droppableId, content._id, {
            title: content.title,
            description: content.description,
            duration: content.duration,
            order: index,
          })
        );

        const responses = await Promise.all(updatePromises);
        if (responses.every((response) => response.success)) {
          setCourse(responses[responses.length - 1].course);
        }
      } catch (error) {
        toast.error("Failed to reorder content");
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Course Not Found
          </h2>
          <button
            onClick={() => navigate("/courses")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
          <p className="text-gray-600 mt-2">{course.description}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setIsEditCourseModalOpen(true)}
            className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Edit Course
          </button>
          <button
            onClick={() => setIsAddSectionModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Section
          </button>
          <button
            onClick={() => setIsAddObjectiveModalOpen(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            + Add Objective
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 shadow-md border border-gray-200 rounded-lg bg-white mb-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold text-gray-800">Objectives</h1>
          {course.objectives
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((objective) => {
              return (
                <div
                  key={objective._id}
                  className="flex justify-between items-center w-full p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50 hover:shadow-md transition-shadow"
                >
                  <p className="text-gray-800">
                    {objective.order} - {objective.title}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedObjective(objective);
                        setIsEditObjectiveModalOpen(true);
                      }}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteObjective(objective._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sections" type="section">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-6"
            >
              {course.sections.map((section, index) => (
                <Draggable
                  key={section._id}
                  draggableId={section._id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="container mx-auto px-4 py-8 shadow-md border border-gray-200 rounded-lg bg-white mb-6"
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="flex justify-between items-center mb-4"
                      >
                        <h2 className="text-xl font-semibold text-gray-800">
                          {section.title}
                        </h2>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedSectionId(section._id);
                              setIsAddContentModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            + Add Content
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSection(section);
                              setIsEditSectionModalOpen(true);
                            }}
                            className="text-yellow-600 hover:text-yellow-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSection(section._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">
                        {section.description}
                      </p>

                      <Droppable droppableId={section._id} type="content">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-4"
                          >
                            {section.content.map((content, index) => (
                              <Draggable
                                key={content._id}
                                draggableId={content._id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="flex justify-between items-center w-full p-3 border border-gray-200 rounded-md shadow-sm bg-gray-50 hover:shadow-md transition-shadow"
                                  >
                                    <div>
                                      <h3 className="font-medium text-gray-800">
                                        {content.title}
                                      </h3>
                                      <p className="text-sm text-gray-600">
                                        {content.description}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        Duration: {content.duration} minutes
                                      </p>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() =>
                                          handlePreviewContent(
                                            section._id,
                                            content._id
                                          )
                                        }
                                        className="text-blue-600 hover:text-blue-800"
                                      >
                                        Preview
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelectedSection(section);
                                          setSelectedContent(content);
                                          setIsEditContentModalOpen(true);
                                        }}
                                        className="text-yellow-600 hover:text-yellow-800"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteContent(
                                            section._id,
                                            content._id
                                          )
                                        }
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <EditCourseModal
        isOpen={isEditCourseModalOpen}
        onClose={() => setIsEditCourseModalOpen(false)}
        onSuccess={() => {
          setIsEditCourseModalOpen(false);
          fetchCourse();
        }}
        course={course}
      />

      <EditSectionModal
        isOpen={isEditSectionModalOpen}
        onClose={() => setIsEditSectionModalOpen(false)}
        onSuccess={() => {
          setIsEditSectionModalOpen(false);
          fetchCourse();
        }}
        courseId={id}
        section={selectedSection}
      />

      <EditObjectiveModal
        isOpen={isEditObjectiveModalOpen}
        onClose={() => setIsEditObjectiveModalOpen(false)}
        onSuccess={() => {
          setIsEditObjectiveModalOpen(false);
          fetchCourse();
        }}
        courseId={id}
        objective={selectedObjective}
      />

      <EditContentModal
        isOpen={isEditContentModalOpen}
        onClose={() => setIsEditContentModalOpen(false)}
        onSuccess={() => {
          setIsEditContentModalOpen(false);
          fetchCourse();
        }}
        courseId={id}
        sectionId={selectedSection?._id}
        content={selectedContent}
      />

      {/* Add Section Modal */}
      {isAddSectionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Add New Section
              </h2>
              <button
                onClick={() => setIsAddSectionModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSection} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newSection.title}
                  onChange={(e) =>
                    setNewSection((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newSection.description}
                  onChange={(e) =>
                    setNewSection((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddSectionModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Objective Modal */}
      {isAddObjectiveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Add New Objective
              </h2>
              <button
                onClick={() => setIsAddObjectiveModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddObjective} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newObjective.title}
                  onChange={(e) =>
                    setNewObjective((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <input
                  type="number"
                  value={newObjective.order}
                  onChange={(e) =>
                    setNewObjective((prev) => ({
                      ...prev,
                      order: e.target.value,
                    }))
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newObjective.description}
                  onChange={(e) =>
                    setNewObjective((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddObjectiveModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Objective
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Content Modal */}
      {isAddContentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Add New Content
              </h2>
              <button
                onClick={() => setIsAddContentModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddContent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newContent.title}
                  onChange={(e) =>
                    setNewContent((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newContent.description}
                  onChange={(e) =>
                    setNewContent((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={newContent.duration}
                  onChange={(e) =>
                    setNewContent((prev) => ({
                      ...prev,
                      duration: parseInt(e.target.value),
                    }))
                  }
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content File
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    setNewContent((prev) => ({
                      ...prev,
                      file: e.target.files[0],
                    }))
                  }
                  required
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mov,.avi"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddContentModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Content
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewModalOpen && previewContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {previewContent.title}
              </h2>
              <button
                onClick={() => {
                  setIsPreviewModalOpen(false);
                  setPreviewContent(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Click the button below to download the content
              </p>
              <a
                href={previewContent.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Content
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
