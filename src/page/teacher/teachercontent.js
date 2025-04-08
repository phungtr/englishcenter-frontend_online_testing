import React, { useState, useEffect } from 'react';
import { getAllClasses, getAllLessons, getAllTeachingContents, createTeachingContent, updateTeachingContent, deleteTeachingContent } from './api'; // Import API functions
import './TeachingContentPage.css'; // Import CSS for styling

const TeachingContentPage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState('');
  const [contents, setContents] = useState([]);
  const [newContent, setNewContent] = useState({ format: '', file: null });
  const [editContent, setEditContent] = useState(null);
  const [selectedContents, setSelectedContents] = useState([]);

  useEffect(() => {
    // Fetch classes
    getAllClasses().then(setClasses);
  }, []);

  useEffect(() => {
    if (selectedClass) {
      getAllLessons().then(setLessons);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedLesson) {
      // Fetch contents for selected lesson
      getAllTeachingContents().then(setContents);
    }
  }, [selectedLesson]);

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', newContent.file);

      // Upload file
      const fileResponse = await axios.post('/api/upload', formData);
      const filePath = fileResponse.data;

      // Lưu metadata
      const teachingContentDTO = {
        format: newContent.format,
        filepath: filePath,
        classId: selectedClass,
        lessonId: selectedLesson,
        // Các trường khác
      };
      const newContentResponse = await createTeachingContent(teachingContentDTO);
      setContents([...contents, newContentResponse]);
      setNewContent({ format: '', file: null });
    } catch (error) {
      console.error('Lỗi khi upload tài liệu:', error);
    }
  };

  const handleEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('file', editContent.file);

      // Upload file mới nếu có
      const fileResponse = await axios.post('/api/upload', formData);
      const filePath = fileResponse.data;

      // Cập nhật metadata
      const teachingContentDTO = {
        format: editContent.format,
        filepath: filePath,
        classId: selectedClass,
        lessonId: selectedLesson,
        // Các trường khác
      };
      const updatedContentResponse = await updateTeachingContent(editContent.id, teachingContentDTO);
      setContents(contents.map(content => (content.id === updatedContentResponse.id ? updatedContentResponse : content)));
      setEditContent(null);
    } catch (error) {
      console.error('Lỗi khi cập nhật tài liệu:', error);
    }
  };

  const handleDelete = async () => {
    try {
      selectedContents.forEach(async contentId => {
        await deleteTeachingContent(contentId);
        setContents(contents.filter(content => content.id !== contentId));
      });
      setSelectedContents([]);
    } catch (error) {
      console.error('Lỗi khi xóa tài liệu:', error);
    }
  };

  return (
    <div className="teaching-content-page">
      <h1>Kho bài giảng</h1>
      <select onChange={(e) => setSelectedClass(e.target.value)}>
        <option value="">Chọn lớp</option>
        {classes.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
      </select>
      {selectedClass && (
        <select onChange={(e) => setSelectedLesson(e.target.value)}>
          <option value="">Chọn bài học</option>
          {lessons.map(lesson => <option key={lesson.id} value={lesson.id}>{lesson.name}</option>)}
        </select>
      )}
      <ul>
        {contents.map(content => (
          <li key={content.id}>
            <input
              type="checkbox"
              checked={selectedContents.includes(content.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedContents([...selectedContents, content.id]);
                } else {
                  setSelectedContents(selectedContents.filter(id => id !== content.id));
                }
              }}
            />
            {content.title}
            <button onClick={() => setEditContent(content)}>Sửa</button>
          </li>
        ))}
      </ul>
      <button onClick={handleDelete}>Xóa</button>
      <div>
        <h2>Thêm tài liệu</h2>
        <select onChange={(e) => setNewContent({ ...newContent, format: e.target.value })}>
          <option value="">Chọn định dạng</option>
          <option value="PDF">PDF</option>
          <option value="DOCX">DOCX</option>
          <option value="PPT">PPT</option>
        </select>
        <input type="file" onChange={(e) => setNewContent({ ...newContent, file: e.target.files[0] })} />
        <button onClick={handleUpload}>Xác nhận</button>
      </div>
      {editContent && (
        <div>
          <h2>Sửa tài liệu</h2>
          <select value={editContent.format} onChange={(e) => setEditContent({ ...editContent, format: e.target.value })}>
            <option value="PDF">PDF</option>
            <option value="DOCX">DOCX</option>
            <option value="PPT">PPT</option>
          </select>
          <input type="file" onChange={(e) => setEditContent({ ...editContent, file: e.target.files[0] })} />
          <button onClick={handleEdit}>Sửa</button>
        </div>
      )}
    </div>
  );
};

export default TeachingContentPage;
