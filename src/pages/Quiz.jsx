import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import QuestionForm from '../components/QuestionForm';
import { getQuizConstants, getQuestions, createQuestion, updateQuestion, deleteQuestion } from '../services/quizService';

export default function Quiz() {
  return (
    <div>
      <App />
    </div>
  );
}

function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <QuizManager />
      </div>
    </div>
  );
}

const QuizManager = () => {
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    sdgSet: ''
  });
  const [constants, setConstants] = useState({
    categories: [],
    sdgSets: []
  });
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCategorySelection, setShowCategorySelection] = useState(false);

  useEffect(() => {
    loadQuizConstants();
    loadQuestions();
  }, [filters]);

  const loadQuizConstants = async () => {
    try {
      const response = await getQuizConstants();
      setConstants({
        categories: response.data.data.categories,
        sdgSets: response.data.data.sdgSets
      });
    } catch (error) {
      setError('Failed to load quiz constants');
      console.error('Error loading quiz constants:', error);
    }
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await getQuestions(filters);
      setQuestions(response.data.questions);
    } catch (error) {
      setError('Failed to load questions');
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (formData) => {
    try {
      await createQuestion(formData);
      setShowForm(false);
      setShowCategorySelection(false);
      loadQuestions();
    } catch (error) {
      setError('Failed to create question');
      console.error('Error creating question:', error);
    }
  };

  const handleUpdateQuestion = async (formData) => {
    try {
      const id = formData.get('id');
      await updateQuestion(id, formData);
      setShowForm(false);
      setEditingQuestion(null);
      loadQuestions();
    } catch (error) {
      setError('Failed to update question');
      console.error('Error updating question:', error);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestion(id);
        loadQuestions();
      } catch (error) {
        setError('Failed to delete question');
        console.error('Error deleting question:', error);
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddQuestion = () => {
    setShowCategorySelection(true);
  };

  const handleCategorySelect = () => {
    const categoryQuestions = questions.filter(
      q => q.category === filters.category && q.sdgSet === filters.sdgSet
    );

    if (categoryQuestions.length >= 10) {
      setError(`Maximum limit of 10 questions reached for this category and SDG set. Please delete some questions first.`);
      return;
    }

    setShowCategorySelection(false);
    setShowForm(true);
  };

  const CategorySelection = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Category and SDG Set</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#507b00] focus:border-[#507b00]"
          >
            <option value="">Select category</option>
            {constants.categories?.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SDG Set</label>
          <select
            name="sdgSet"
            value={filters.sdgSet}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#507b00] focus:border-[#507b00]"
          >
            <option value="">Select SDG set</option>
            {constants.sdgSets?.map(set => (
              <option key={set.value} value={set.value}>
                {set.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowCategorySelection(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleCategorySelect}
            disabled={!filters.category || !filters.sdgSet}
            className="px-4 py-2 text-sm font-medium text-white bg-[#507b00] rounded-lg hover:bg-[#456a00] focus:outline-none focus:ring-2 focus:ring-[#507b00] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Questions</h1>
          {!showForm && !showCategorySelection && (
            <button
              onClick={handleAddQuestion}
              className="px-4 py-2 bg-[#507b00] text-white rounded-lg hover:bg-[#456a00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#507b00]"
            >
              Add New Question
            </button>
          )}
        </div>
        
        <div className="flex gap-4 mb-6">
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#507b00] focus:border-[#507b00]"
          >
            <option value="">All Categories</option>
            {constants.categories?.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <select
            name="sdgSet"
            value={filters.sdgSet}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#507b00] focus:border-[#507b00]"
          >
            <option value="">All SDG Sets</option>
            {constants.sdgSets?.map(set => (
              <option key={set.value} value={set.value}>
                {set.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {showCategorySelection ? (
        <CategorySelection />
      ) : showForm ? (
        <div className="bg-white rounded-xl shadow-sm">
          <QuestionForm
            question={editingQuestion}
            onSubmit={editingQuestion ? handleUpdateQuestion : handleCreateQuestion}
            onCancel={() => {
              setShowForm(false);
              setEditingQuestion(null);
            }}
            initialCategory={filters.category}
            initialSdgSet={filters.sdgSet}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading questions...</div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No questions found</div>
          ) : (
            questions.map((question) => (
              <div key={question.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{question.question}</h3>
                    <div className="flex gap-2 mb-4">
                      <span className="px-3 py-1 text-sm font-medium text-[#507b00] bg-green-50 rounded-full">
                        {question.category}
                      </span>
                      <span className="px-3 py-1 text-sm font-medium text-[#507b00] bg-green-50 rounded-full">
                        {question.sdgSet}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {question.options.map((option, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            option === question.correctAnswer
                              ? 'border-[#507b00] bg-green-50'
                              : 'border-gray-200'
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setEditingQuestion(question);
                        setShowForm(true);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question._id)}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};