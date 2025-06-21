import React, { useState, useEffect } from 'react';
import { getQuizConstants } from '../services/quizService';

const QuestionForm = ({ question, onSubmit, onCancel, initialCategory, initialSdgSet }) => {
  const [formData, setFormData] = useState({
    id: null,
    question: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
    category: initialCategory || '',
    sdgSet: initialSdgSet || '',
    questionImage: null,
    revealingCardImage: null
  });

  const [constants, setConstants] = useState({
    categories: [],
    sdgSets: []
  });

  const [errors, setErrors] = useState({});
  const [questionImagePreview, setQuestionImagePreview] = useState(null);
  const [revealingCardImagePreview, setRevealingCardImagePreview] = useState(null);

  useEffect(() => {
    // Load quiz constants
    const loadConstants = async () => {
      try {
        const response = await getQuizConstants();
        setConstants(response.data);
      } catch (error) {
        console.error('Error loading quiz constants:', error);
      }
    };
    loadConstants();

    // If editing, populate form with existing question data
    if (question) {
        console.log("question", question);
      setFormData({
        id: question._id,
        question: question.question,
        options: question.options,
        correctAnswerIndex: question.correctAnswer,
        category: question.category,
        sdgSet: question.sdgSet,
        questionImage: null,
        revealingCardImage: null
      });
      setQuestionImagePreview(question.questionImage);
      setRevealingCardImagePreview(question.revealingCardImage);
    }
  }, [question]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const handleCorrectAnswerChange = (index) => {
    setFormData(prev => ({
      ...prev,
      correctAnswerIndex: index
    }));
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'question') {
        setFormData(prev => ({
          ...prev,
          questionImage: file
        }));
        setQuestionImagePreview(URL.createObjectURL(file));
      } else {
        setFormData(prev => ({
          ...prev,
          revealingCardImage: file
        }));
        setRevealingCardImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    }
    
    // Check if all 4 options are filled
    if (formData.options.length !== 4) {
      newErrors.options = 'Exactly 4 options are required';
    } else if (formData.options.some(option => !option.trim())) {
      newErrors.options = 'All 4 options are required';
    }
    
    // Check for duplicate options
    if (formData.options.length !== new Set(formData.options.map(opt => opt.trim())).size) {
      newErrors.options = 'Options must be unique';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formDataToSubmit = new FormData();
      const id = formData.id;
      if (id) {
        formDataToSubmit.append('id', id);
      }
      formDataToSubmit.append('question', formData.question);
      formDataToSubmit.append('options', JSON.stringify(formData.options));
      formDataToSubmit.append('correctAnswerIndex', formData.correctAnswerIndex);
      formDataToSubmit.append('category', formData.category);
      formDataToSubmit.append('sdgSet', formData.sdgSet);
      
      if (formData.questionImage) {
        formDataToSubmit.append('questionImage', formData.questionImage);
      }
      if (formData.revealingCardImage) {
        formDataToSubmit.append('revealingCardImage', formData.revealingCardImage);
      }

      onSubmit(formDataToSubmit);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
        <textarea
          name="question"
          value={formData.question}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#507b00] focus:border-[#507b00] ${
            errors.question ? 'border-red-500' : 'border-gray-300'
          }`}
          rows="3"
        />
        {errors.question && (
          <p className="mt-1 text-sm text-red-600">{errors.question}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
        {formData.options.map((option, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center gap-4">
              <input
                type="radio"
                name="correctAnswer"
                checked={formData.correctAnswerIndex === index}
                onChange={() => handleCorrectAnswerChange(index)}
                className="h-4 w-4 text-[#507b00] focus:ring-[#507b00] border-gray-300"
              />
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#507b00] focus:border-[#507b00] ${
                  errors.options ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={`Option ${index + 1}`}
              />
            </div>
          </div>
        ))}
        {errors.options && (
          <p className="mt-1 text-sm text-red-600">{errors.options}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Question Image</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'question')}
                className="hidden"
                id="question-image"
              />
              <label
                htmlFor="question-image"
                className="cursor-pointer bg-white rounded-md font-medium text-[#507b00] hover:text-[#456a00] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#507b00]"
              >
                <span>Upload a file</span>
              </label>
              {questionImagePreview && (
                <div className="mt-2">
                  <img
                    src={questionImagePreview}
                    alt="Question"
                    className="mx-auto h-32 w-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Revealing Card Image</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'revealingCard')}
                className="hidden"
                id="revealing-card-image"
              />
              <label
                htmlFor="revealing-card-image"
                className="cursor-pointer bg-white rounded-md font-medium text-[#507b00] hover:text-[#456a00] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#507b00]"
              >
                <span>Upload a file</span>
              </label>
              {revealingCardImagePreview && (
                <div className="mt-2">
                  <img
                    src={revealingCardImagePreview}
                    alt="Revealing Card"
                    className="mx-auto h-32 w-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-[#507b00] rounded-lg hover:bg-[#456a00] focus:outline-none focus:ring-2 focus:ring-[#507b00]"
        >
          {question ? 'Update Question' : 'Create Question'}
        </button>
      </div>
    </form>
  );
};

export default QuestionForm; 