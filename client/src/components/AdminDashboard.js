import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Toast from './Toast';

const SectionCard = ({ title, children }) => (
  <div className="contact-form" style={{ marginBottom: 24, width: '100%' }}>
    <div className="section-title" style={{ marginBottom: 20 }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '1.5rem', fontWeight: '700' }}>{title}</h2>
    </div>
    <div style={{ width: '100%' }}>
      {children}
    </div>
  </div>
);

const AdminDashboard = ({ profile: initialProfile, refreshProfile }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(initialProfile || {});
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [resume, setResume] = useState(null);
  const [status, setStatus] = useState('');
  const [activePage, setActivePage] = useState('profile'); // profile, skills, interests, education, certs, projects
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordFormKey, setPasswordFormKey] = useState(0);
  const [adminInfo, setAdminInfo] = useState(null);
  const [passwordInfo, setPasswordInfo] = useState(null);
  const [toast, setToast] = useState(null);
  const [editingCert, setEditingCert] = useState(null);
  const [editingInterest, setEditingInterest] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [editingEducation, setEditingEducation] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [newCert, setNewCert] = useState({ title: '', issuer: '', year: '', image: null, imagePreview: '' });
  const [newInterest, setNewInterest] = useState({ title: '', description: '', image: null, imagePreview: '', projects: '' });
  const [newProject, setNewProject] = useState({ title: '', description: '', tags: '', codeLink: '', demoLink: '' });
  const [tagColors, setTagColors] = useState({});

  const loadAll = async () => {
    try {
      const [s, i, e, c, p, r] = await Promise.all([
        api.getSkills(),
        api.getInterests(),
        api.getEducation(),
        api.getCertifications(),
        api.getProjects(),
        api.getResume(),
      ]);
      setSkills(s || []);
      setInterests(i || []);
      setEducation(e || []);
      setCertifications(c || []);
      setProjects(p || []);
      setResume(r || null);
    } catch (err) {
      setStatus('Error loading data');
    }
  };

  useEffect(() => {
    loadAll();
    loadAdminInfo();
    loadPasswordInfo();
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await api.getProfile();
      if (profileData && Object.keys(profileData).length > 0) {
        setProfile(profileData);
        refreshProfile(profileData);
        if (profileData.photo) {
          setProfileImagePreview(profileData.photo.startsWith('http') ? profileData.photo : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${profileData.photo}`);
        }
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      // Keep using initialProfile if API fails
    }
  };

  const loadAdminInfo = async () => {
    try {
      // Try to get from API first
      const info = await api.getCurrentAdmin();
      setAdminInfo(info);
      localStorage.setItem('adminInfo', JSON.stringify(info));
    } catch (err) {
      // Fallback to localStorage if API fails
      const stored = localStorage.getItem('adminInfo');
      if (stored) {
        try {
          setAdminInfo(JSON.parse(stored));
        } catch (e) {
          console.error('Error parsing admin info:', e);
        }
      }
    }
  };

  const loadPasswordInfo = async () => {
    try {
      const info = await api.getPasswordInfo();
      setPasswordInfo(info);
    } catch (err) {
      console.error('Error loading password info:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminInfo');
    navigate('/', { replace: true });
  };

  const handleProfileSave = async () => {
    try {
      const formData = new FormData();
      Object.keys(profile).forEach(key => {
        if (key === 'about') {
          formData.append('about', JSON.stringify(profile.about));
        } else if (key !== 'photo') { // Don't send photo string if we have a file, or handle separately
          formData.append(key, profile[key]);
        }
      });

      if (profileImage) {
        formData.append('image', profileImage);
      }

      if (profile.deletePhoto) {
        formData.append('deletePhoto', 'true');
      }

      const updated = await api.updateProfile(formData);
      refreshProfile(updated);
      setProfile(updated);
      setIsEditingProfile(false);
      setProfileImage(null);
      // Update preview based on new data
      if (updated.photo) {
        setProfileImagePreview(updated.photo.startsWith('http') ? updated.photo : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${updated.photo}`);
      } else {
        setProfileImagePreview(null);
      }
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Error saving profile', 'error');
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
      setProfile({ ...profile, deletePhoto: false });
    }
  };

  const handleDeleteProfilePhoto = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    setProfile({ ...profile, deletePhoto: true });
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showToast('All password fields are required', 'error');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New password and confirm password do not match', 'error');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showToast('New password must be at least 6 characters long', 'error');
      return;
    }

    try {
      await api.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      // Clear form and force re-render
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswords({ current: false, new: false, confirm: false });
      setPasswordFormKey(prev => prev + 1); // Force form reset
      showToast('Password changed successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Error changing password', 'error');
    }
  };

  const handleAddSkill = async () => {
    setStatus('Adding skill...');
    try {
      const name = prompt('Skill name?');
      const logo = prompt('Skill logo URL?');
      if (!name || !logo) return;
      const created = await api.createSkill({ name, logo });
      setSkills([...skills, created]);
      setStatus('Skill added');
    } catch {
      setStatus('Error adding skill');
    }
  };

  const handleUpdateSkill = async (skill) => {
    try {
      await api.updateSkill(skill._id, skill);
      setEditingSkill(null);
      showToast('Skill updated successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Error updating skill', 'error');
    }
  };

  const handleDeleteSkill = async (id) => {
    setStatus('Deleting skill...');
    try {
      await api.deleteSkill(id);
      setSkills(skills.filter((s) => s._id !== id));
      setStatus('Skill deleted');
    } catch {
      setStatus('Error deleting skill');
    }
  };

  const handleAddInterest = async () => {
    if (!newInterest.title || !newInterest.description) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', newInterest.title);
      formData.append('description', newInterest.description);
      formData.append('projects', newInterest.projects);
      if (newInterest.image) {
        formData.append('image', newInterest.image);
      }
      const created = await api.createInterest(formData);
      setInterests([...interests, created]);
      setNewInterest({ title: '', description: '', image: null, imagePreview: '', projects: '' });
      showToast('Interest added successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Error adding interest', 'error');
    }
  };

  const handleInterestImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewInterest({
        ...newInterest,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleEditInterestImageChange = (e, interestId) => {
    const file = e.target.files[0];
    if (file) {
      setInterests(interests.map(i =>
        i._id === interestId
          ? { ...i, imageFile: file, imagePreview: URL.createObjectURL(file) }
          : i
      ));
    }
  };

  const handleUpdateInterest = async (interest) => {
    try {
      const formData = new FormData();
      formData.append('title', interest.title);
      formData.append('description', interest.description);
      formData.append('projects', (interest.projects || []).join(','));
      if (interest.imageFile) {
        formData.append('image', interest.imageFile);
      }
      const updated = await api.updateInterest(interest._id, formData);
      setInterests(interests.map(i => i._id === interest._id ? updated : i));
      setEditingInterest(null);
      showToast('Interest updated successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Error updating interest', 'error');
    }
  };

  const handleDeleteInterest = async (id) => {
    setStatus('Deleting interest...');
    try {
      await api.deleteInterest(id);
      setInterests(interests.filter((i) => i._id !== id));
      setStatus('Interest deleted');
    } catch {
      setStatus('Error deleting interest');
    }
  };

  const handleAddEducation = async () => {
    const degree = prompt('Degree?');
    const institution = prompt('Institution?');
    const period = prompt('Period?');
    const description = prompt('Description?');
    if (!degree || !institution || !period || !description) return;
    setStatus('Adding education...');
    try {
      const created = await api.createEducation({ degree, institution, period, description });
      setEducation([...education, created]);
      setStatus('Education added');
    } catch {
      setStatus('Error adding education');
    }
  };

  const handleUpdateEducation = async (edu) => {
    try {
      await api.updateEducation(edu._id, edu);
      setEditingEducation(null);
      showToast('Education updated successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Error updating education', 'error');
    }
  };

  const handleDeleteEducation = async (id) => {
    setStatus('Deleting education...');
    try {
      await api.deleteEducation(id);
      setEducation(education.filter((e) => e._id !== id));
      setStatus('Education deleted');
    } catch {
      setStatus('Error deleting education');
    }
  };

  const handleAddCertification = async () => {
    if (!newCert.title || !newCert.issuer || !newCert.year) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', newCert.title);
      formData.append('issuer', newCert.issuer);
      formData.append('year', newCert.year);
      if (newCert.image) {
        formData.append('image', newCert.image);
      }
      const created = await api.createCertification(formData);
      setCertifications([...certifications, created]);
      setNewCert({ title: '', issuer: '', year: '', image: null, imagePreview: '' });
      showToast('Certification added successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Error adding certification', 'error');
    }
  };

  const handleCertImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCert({
        ...newCert,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleEditCertImageChange = (e, certId) => {
    const file = e.target.files[0];
    if (file) {
      setCertifications(certifications.map(c =>
        c._id === certId
          ? { ...c, imageFile: file, imagePreview: URL.createObjectURL(file) }
          : c
      ));
    }
  };

  const handleUpdateCertification = async (cert) => {
    try {
      const formData = new FormData();
      formData.append('title', cert.title);
      formData.append('issuer', cert.issuer);
      formData.append('year', cert.year);
      if (cert.imageFile) {
        formData.append('image', cert.imageFile);
      }
      const updated = await api.updateCertification(cert._id, formData);
      setCertifications(certifications.map(c => c._id === cert._id ? updated : c));
      setEditingCert(null);
      showToast('Certification updated successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Error updating certification', 'error');
    }
  };

  const handleDeleteCertification = async (id) => {
    setStatus('Deleting certification...');
    try {
      await api.deleteCertification(id);
      setCertifications(certifications.filter((c) => c._id !== id));
      setStatus('Certification deleted');
    } catch {
      setStatus('Error deleting certification');
    }
  };

  const getRandomColor = () => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
      '#E76F51', '#2A9D8F', '#E9C46A', '#F4A261', '#264653',
      '#8338EC', '#FF006E', '#FB5607', '#FFBE0B', '#3A86FF'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const [tagInput, setTagInput] = useState('');
  const [editTagInput, setEditTagInput] = useState('');

  const handleAddManualTagToNew = () => {
    if (!tagInput.trim()) return;
    const currentTags = newProject.tags.split(',').map(t => t.trim()).filter(Boolean);
    if (!currentTags.includes(tagInput.trim())) {
      const tag = tagInput.trim();
      if (!tagColors[tag]) {
        setTagColors(prev => ({ ...prev, [tag]: getRandomColor() }));
      }
      const newTags = [...currentTags, tag].join(', ');
      setNewProject({ ...newProject, tags: newTags });
      setTagInput('');
    }
  };

  const handleAddManualTagToEdit = (project) => {
    if (!editTagInput.trim()) return;
    const currentTags = project.tags || [];
    if (!currentTags.includes(editTagInput.trim())) {
      const tag = editTagInput.trim();
      if (!tagColors[tag]) {
        setTagColors(prev => ({ ...prev, [tag]: getRandomColor() }));
      }
      const updatedTags = [...currentTags, tag];
      setProjects(projects.map(p => p._id === project._id ? { ...p, tags: updatedTags } : p));
      setEditTagInput('');
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.description) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    try {
      const tagsArray = newProject.tags.split(',').map((t) => t.trim()).filter(Boolean);

      // Assign random colors to new tags
      const newColors = { ...tagColors };
      tagsArray.forEach(tag => {
        if (!newColors[tag]) {
          newColors[tag] = getRandomColor();
        }
      });
      setTagColors(newColors);

      const created = await api.createProject({
        title: newProject.title,
        description: newProject.description,
        tags: tagsArray,
        codeLink: newProject.codeLink,
        demoLink: newProject.demoLink,
      });
      setProjects([...projects, created]);
      setNewProject({ title: '', description: '', tags: '', codeLink: '', demoLink: '' });
      showToast('Project added successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Error adding project', 'error');
    }
  };



  const handleUpdateProject = async (project) => {
    try {
      await api.updateProject(project._id, project);
      setEditingProject(null);
      showToast('Project updated successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Error updating project', 'error');
    }
  };

  const handleDeleteProject = async (id) => {
    setStatus('Deleting project...');
    try {
      await api.deleteProject(id);
      setProjects(projects.filter((p) => p._id !== id));
      setStatus('Project deleted');
    } catch {
      setStatus('Error deleting project');
    }
  };

  const handleUploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showToast('Please upload a PDF file', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setStatus('Uploading resume...');
    try {
      const uploaded = await api.uploadResume(formData);
      setResume(uploaded);
      showToast('Resume uploaded successfully!', 'success');
      setStatus('');
    } catch (err) {
      showToast(err.response?.data?.error || 'Error uploading resume', 'error');
      setStatus('');
    }
  };

  const handleDeleteResume = async () => {
    if (!resume || !resume._id) return;
    if (!window.confirm('Are you sure you want to delete the resume?')) return;

    setStatus('Deleting resume...');
    try {
      await api.deleteResume(resume._id);
      setResume(null);
      showToast('Resume deleted successfully!', 'success');
      setStatus('');
    } catch (err) {
      showToast(err.response?.data?.error || 'Error deleting resume', 'error');
      setStatus('');
    }
  };

  return (
    <div className="section" style={{ paddingTop: 30, maxWidth: '1400px', margin: '0 auto' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2>Admin Dashboard</h2>
          <p style={{ margin: '6px 0 0', color: 'var(--muted)' }}>Manage portfolio content</p>
        </div>
        <button className="btn ghost" onClick={logout} style={{ alignSelf: 'flex-start' }}>Logout</button>
      </div>
      {status && <p className="form-status" style={{ marginBottom: '16px' }}>{status}</p>}

      {/* Category navigation as separate "pages" */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24, justifyContent: 'flex-start' }}>
        {['profile', 'skills', 'interests', 'education', 'certs', 'projects', 'resume'].map((key) => (
          <button
            key={key}
            className={`btn ${activePage === key ? 'primary' : 'ghost'}`}
            onClick={() => setActivePage(key)}
            style={{ transition: 'all 0.3s ease' }}
          >
            {key === 'certs' ? 'Certifications' : key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {activePage === 'profile' && (
        <SectionCard title="Profile & About">
          <p className="label">Name</p>
          <input
            type="text"
            placeholder="Name"
            value={profile.name || ''}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            disabled={!isEditingProfile}
          />
          <p className="label">Subtitle</p>
          <input
            type="text"
            placeholder="Subtitle"
            value={profile.subtitle || ''}
            onChange={(e) => setProfile({ ...profile, subtitle: e.target.value })}
            disabled={!isEditingProfile}
          />
          <p className="label">Email</p>
          <input
            type="email"
            placeholder="Email"
            value={profile.email || ''}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            disabled={!isEditingProfile}
          />
          <p className="label">Phone</p>
          <input
            type="text"
            placeholder="Phone"
            value={profile.phone || ''}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            disabled={!isEditingProfile}
          />
          <p className="label">GitHub URL</p>
          <input
            type="text"
            placeholder="GitHub URL"
            value={profile.github || ''}
            onChange={(e) => setProfile({ ...profile, github: e.target.value })}
            disabled={!isEditingProfile}
          />
          <p className="label">LinkedIn URL</p>
          <input
            type="text"
            placeholder="LinkedIn URL"
            value={profile.linkedin || ''}
            onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
            disabled={!isEditingProfile}
          />
          <p className="label">Photo URL</p>
          <div className="mb-4">
            <p className="label" style={{ marginBottom: '8px' }}>Profile Photo</p>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'var(--input-bg)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {profileImagePreview ? (
                  <img src={profileImagePreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <i className="bi bi-person" style={{ fontSize: '2rem', color: 'var(--muted)' }}></i>
                )}
              </div>

              {isEditingProfile && (
                <div style={{ flex: 1 }}>
                  <div className="d-flex gap-2 align-items-center">
                    <label className="btn btn-outline-primary" style={{ cursor: 'pointer' }}>
                      <i className="bi bi-upload me-2"></i>Upload Photo
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        hidden
                      />
                    </label>
                    {(profileImagePreview && (profile.photo || profileImage)) && (
                      <button className="btn btn-danger" onClick={handleDeleteProfilePhoto}>
                        <i className="bi bi-trash me-2"></i>Remove
                      </button>
                    )}
                  </div>
                  <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.85rem' }}>
                    Upload a new photo to replace the current one.
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className="label">Location</p>
          <input
            type="text"
            placeholder="Location"
            value={profile.location || ''}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            disabled={!isEditingProfile}
          />
          <p className="label">Education (headline)</p>
          <input
            type="text"
            placeholder="Education"
            value={profile.education || ''}
            onChange={(e) => setProfile({ ...profile, education: e.target.value })}
            disabled={!isEditingProfile}
          />
          <p className="label">Focus</p>
          <input
            type="text"
            placeholder="Focus"
            value={profile.focus || ''}
            onChange={(e) => setProfile({ ...profile, focus: e.target.value })}
            disabled={!isEditingProfile}
          />
          <p className="label">About paragraph 1</p>
          <textarea
            rows="3"
            placeholder="About paragraph 1"
            value={profile.about?.paragraph1 || ''}
            onChange={(e) => setProfile({ ...profile, about: { ...profile.about, paragraph1: e.target.value } })}
            disabled={!isEditingProfile}
          />
          <p className="label">About paragraph 2</p>
          <textarea
            rows="3"
            placeholder="About paragraph 2"
            value={profile.about?.paragraph2 || ''}
            onChange={(e) => setProfile({ ...profile, about: { ...profile.about, paragraph2: e.target.value } })}
            disabled={!isEditingProfile}
          />

          {!isEditingProfile ? (
            <button className="btn btn-primary" onClick={() => setIsEditingProfile(true)}>
              <i className="bi bi-pencil me-2"></i>Edit Profile
            </button>
          ) : (
            <div className="d-flex gap-2">
              <button className="btn btn-primary" onClick={handleProfileSave}>
                <i className="bi bi-check-circle me-2"></i>Save Changes
              </button>
              <button className="btn btn-secondary" onClick={() => {
                setIsEditingProfile(false);
                // Reset to initial profile state logic if needed, for now just lock
                // Ideally we should reload or reset state
                loadProfile();
                setProfileImage(null);
              }}>
                Cancel
              </button>
            </div>
          )}
        </SectionCard>
      )}

      {activePage === 'profile' && (
        <SectionCard title="Change Password">
          {adminInfo && (
            <div style={{
              marginBottom: '16px',
              padding: '12px',
              background: 'var(--input-bg)',
              borderRadius: '8px',
              border: '1px solid var(--border)'
            }}>
              <p style={{ margin: '0 0 4px', fontSize: '13px', color: 'var(--muted)' }}>Current Admin Account</p>
              <p style={{ margin: '0', fontWeight: '600', color: 'var(--accent-2)' }}>
                {adminInfo.username} ({adminInfo.email})
              </p>
            </div>
          )}
          {passwordInfo && (
            <div style={{
              marginBottom: '16px',
              padding: '12px',
              background: 'var(--input-bg)',
              borderRadius: '8px',
              border: '1px solid var(--border)'
            }}>
              <p className="label" style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--muted)' }}>Current Password (from database)</p>
              <input
                type="text"
                value={passwordInfo.passwordMasked || '••••••••'}
                readOnly
                disabled
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  color: 'var(--text)',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  cursor: 'not-allowed',
                  opacity: 0.7
                }}
              />
              <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--muted)', fontStyle: 'italic' }}>
                Password is stored securely (hashed) in the database
              </p>
            </div>
          )}
          <p className="label">Enter Current Password to Change</p>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              key={`current-password-${passwordFormKey}`}
              type={showPasswords.current ? 'text' : 'password'}
              placeholder="Enter current password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              style={{ paddingRight: '45px', width: '100%' }}
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
              className="password-toggle"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label={showPasswords.current ? 'Hide password' : 'Show password'}
            >
              {showPasswords.current ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <p className="label">New Password</p>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              key={`new-password-${passwordFormKey}`}
              type={showPasswords.new ? 'text' : 'password'}
              placeholder="Enter new password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              style={{ paddingRight: '45px', width: '100%' }}
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
              className="password-toggle"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label={showPasswords.new ? 'Hide password' : 'Show password'}
            >
              {showPasswords.new ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <p className="label">Confirm New Password</p>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              key={`confirm-password-${passwordFormKey}`}
              type={showPasswords.confirm ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              style={{ paddingRight: '45px', width: '100%' }}
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
              className="password-toggle"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label={showPasswords.confirm ? 'Hide password' : 'Show password'}
            >
              {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <button className="btn primary" onClick={handleChangePassword}>Change Password</button>
        </SectionCard>
      )}

      {activePage === 'skills' && (
        <SectionCard title="Skills">
          <button className="btn primary" onClick={handleAddSkill} style={{ marginBottom: 12 }}>Add Skill</button>
          {skills.map((skill) => (
            <div key={skill._id} className="card mb-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="card-header d-flex justify-content-between align-items-center" style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
                <h5 className="mb-0">{skill.name || 'Untitled'}</h5>
                {editingSkill !== skill._id && (
                  <button className="btn btn-sm btn-outline-primary" onClick={() => setEditingSkill(skill._id)}>
                    <i className="bi bi-pencil me-1"></i>Edit
                  </button>
                )}
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Skill name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={skill.name}
                    onChange={(e) => setSkills(skills.map((s) => (s._id === skill._id ? { ...s, name: e.target.value } : s)))}
                    disabled={editingSkill !== skill._id}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Logo URL <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={skill.logo}
                    onChange={(e) => setSkills(skills.map((s) => (s._id === skill._id ? { ...s, logo: e.target.value } : s)))}
                    disabled={editingSkill !== skill._id}
                  />
                </div>
                {editingSkill === skill._id && (
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={() => handleUpdateSkill(skill)}>
                      <i className="bi bi-check-circle me-1"></i>Update
                    </button>
                    <button className="btn btn-secondary" onClick={() => setEditingSkill(null)}>
                      Cancel
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteSkill(skill._id)}>
                      <i className="bi bi-trash me-1"></i>Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </SectionCard>
      )}

      {activePage === 'interests' && (
        <SectionCard title="Area of Interest">
          <div className="card mb-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="card-header" style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
              <h5 className="mb-0">Add New Interest</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Title <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={newInterest.title}
                  onChange={(e) => setNewInterest({ ...newInterest, title: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description <span className="text-danger">*</span></label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={newInterest.description}
                  onChange={(e) => setNewInterest({ ...newInterest, description: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Projects (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  value={newInterest.projects}
                  onChange={(e) => setNewInterest({ ...newInterest, projects: e.target.value })}
                  placeholder="Project 1, Project 2, Project 3"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleInterestImageChange}
                />
                {newInterest.imagePreview && (
                  <div className="mt-2">
                    <img src={newInterest.imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }} />
                  </div>
                )}
              </div>
              <button className="btn btn-primary" onClick={handleAddInterest}>
                <i className="bi bi-plus-circle me-2"></i>Add Interest
              </button>
            </div>
          </div>

          {interests.map((interest) => (
            <div key={interest._id} className="card mb-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="card-header d-flex justify-content-between align-items-center" style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
                <h5 className="mb-0">{interest.title || 'Untitled'}</h5>
                {editingInterest !== interest._id && (
                  <button className="btn btn-sm btn-outline-primary" onClick={() => setEditingInterest(interest._id)}>
                    <i className="bi bi-pencil me-1"></i>Edit
                  </button>
                )}
              </div>
              <div className="card-body">
                {(interest.image || interest.imagePreview) && (
                  <div className="mb-3 text-center">
                    <img
                      src={interest.imagePreview || (interest.image?.startsWith('http') ? interest.image : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${interest.image}`)}
                      alt={interest.title}
                      style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', border: '1px solid var(--border)' }}
                    />
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">Title <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={interest.title}
                    onChange={(e) =>
                      setInterests(interests.map((i) => (i._id === interest._id ? { ...i, title: e.target.value } : i)))
                    }
                    disabled={editingInterest !== interest._id}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description <span className="text-danger">*</span></label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={interest.description}
                    onChange={(e) =>
                      setInterests(
                        interests.map((i) => (i._id === interest._id ? { ...i, description: e.target.value } : i))
                      )
                    }
                    disabled={editingInterest !== interest._id}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Projects (comma separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={(interest.projects || []).join(', ')}
                    onChange={(e) =>
                      setInterests(
                        interests.map((i) =>
                          i._id === interest._id
                            ? { ...i, projects: e.target.value.split(',').map((p) => p.trim()).filter(Boolean) }
                            : i
                        )
                      )
                    }
                    disabled={editingInterest !== interest._id}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => handleEditInterestImageChange(e, interest._id)}
                    disabled={editingInterest !== interest._id}
                  />
                </div>
                {editingInterest === interest._id && (
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={() => handleUpdateInterest(interest)}>
                      <i className="bi bi-check-circle me-1"></i>Update
                    </button>
                    <button className="btn btn-secondary" onClick={() => setEditingInterest(null)}>
                      Cancel
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteInterest(interest._id)}>
                      <i className="bi bi-trash me-1"></i>Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </SectionCard>
      )}

      {activePage === 'education' && (
        <SectionCard title="Education">
          <button className="btn primary" onClick={handleAddEducation} style={{ marginBottom: 12 }}>Add Education</button>
          {education.map((edu) => (
            <div key={edu._id} className="card mb-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="card-header d-flex justify-content-between align-items-center" style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
                <h5 className="mb-0">{edu.degree || 'Untitled'}</h5>
                {editingEducation !== edu._id && (
                  <button className="btn btn-sm btn-outline-primary" onClick={() => setEditingEducation(edu._id)}>
                    <i className="bi bi-pencil me-1"></i>Edit
                  </button>
                )}
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Degree <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={edu.degree}
                    onChange={(e) =>
                      setEducation(education.map((item) => (item._id === edu._id ? { ...item, degree: e.target.value } : item)))
                    }
                    disabled={editingEducation !== edu._id}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Institution <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={edu.institution}
                    onChange={(e) =>
                      setEducation(
                        education.map((item) => (item._id === edu._id ? { ...item, institution: e.target.value } : item))
                      )
                    }
                    disabled={editingEducation !== edu._id}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Period <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={edu.period}
                    onChange={(e) =>
                      setEducation(education.map((item) => (item._id === edu._id ? { ...item, period: e.target.value } : item)))
                    }
                    disabled={editingEducation !== edu._id}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description <span className="text-danger">*</span></label>
                  <textarea
                    rows="2"
                    className="form-control"
                    value={edu.description}
                    onChange={(e) =>
                      setEducation(
                        education.map((item) => (item._id === edu._id ? { ...item, description: e.target.value } : item))
                      )
                    }
                    disabled={editingEducation !== edu._id}
                  />
                </div>
                {editingEducation === edu._id && (
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={() => handleUpdateEducation(edu)}>
                      <i className="bi bi-check-circle me-1"></i>Update
                    </button>
                    <button className="btn btn-secondary" onClick={() => setEditingEducation(null)}>
                      Cancel
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteEducation(edu._id)}>
                      <i className="bi bi-trash me-1"></i>Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </SectionCard>
      )}

      {activePage === 'certs' && (
        <SectionCard title="Certifications">
          <div className="card mb-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="card-header" style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
              <h5 className="mb-0">Add New Certification</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Title <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={newCert.title}
                  onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Issuer <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Year <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={newCert.year}
                  onChange={(e) => setNewCert({ ...newCert, year: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleCertImageChange}
                />
                {newCert.imagePreview && (
                  <div className="mt-2">
                    <img src={newCert.imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }} />
                  </div>
                )}
              </div>
              <button className="btn btn-primary" onClick={handleAddCertification}>
                <i className="bi bi-plus-circle me-2"></i>Add Certification
              </button>
            </div>
          </div>

          {certifications.map((cert) => (
            <div key={cert._id} className="card mb-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="card-header d-flex justify-content-between align-items-center" style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
                <h5 className="mb-0">{cert.title || 'Untitled'}</h5>
                {editingCert !== cert._id && (
                  <button className="btn btn-sm btn-outline-primary" onClick={() => setEditingCert(cert._id)}>
                    <i className="bi bi-pencil me-1"></i>Edit
                  </button>
                )}
              </div>
              <div className="card-body">
                {(cert.image || cert.imagePreview) && (
                  <div className="mb-3 text-center">
                    <img
                      src={cert.imagePreview || (cert.image?.startsWith('http') ? cert.image : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${cert.image}`)}
                      alt={cert.title}
                      style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', border: '1px solid var(--border)' }}
                    />
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">Title <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={cert.title}
                    onChange={(e) =>
                      setCertifications(
                        certifications.map((c) => (c._id === cert._id ? { ...c, title: e.target.value } : c))
                      )
                    }
                    disabled={editingCert !== cert._id}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Issuer <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={cert.issuer}
                    onChange={(e) =>
                      setCertifications(
                        certifications.map((c) => (c._id === cert._id ? { ...c, issuer: e.target.value } : c))
                      )
                    }
                    disabled={editingCert !== cert._id}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Year <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={cert.year}
                    onChange={(e) =>
                      setCertifications(
                        certifications.map((c) => (c._id === cert._id ? { ...c, year: e.target.value } : c))
                      )
                    }
                    disabled={editingCert !== cert._id}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => handleEditCertImageChange(e, cert._id)}
                    disabled={editingCert !== cert._id}
                  />
                </div>
                {editingCert === cert._id && (
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={() => handleUpdateCertification(cert)}>
                      <i className="bi bi-check-circle me-1"></i>Update
                    </button>
                    <button className="btn btn-secondary" onClick={() => setEditingCert(null)}>
                      Cancel
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteCertification(cert._id)}>
                      <i className="bi bi-trash me-1"></i>Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </SectionCard>
      )}

      {activePage === 'projects' && (
        <SectionCard title="Projects">
          <div className="card mb-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="card-header" style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
              <h5 className="mb-0">Add New Project</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Title <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="Enter project title"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description <span className="text-danger">*</span></label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Enter project description"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Tech Stack</label>
                {newProject.tags && (
                  <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {newProject.tags.split(',').map(t => t.trim()).filter(Boolean).map((tag, idx) => {
                      const color = tagColors[tag] || getRandomColor();
                      if (!tagColors[tag]) {
                        setTagColors(prev => ({ ...prev, [tag]: color }));
                      }
                      return (
                        <span
                          key={idx}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            background: color,
                            color: '#fff',
                            fontSize: '13px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => {
                              const currentTags = newProject.tags.split(',').map(t => t.trim()).filter(Boolean);
                              const updatedTags = currentTags.filter(t => t !== tag).join(', ');
                              setNewProject({ ...newProject, tags: updatedTags });
                            }}
                            style={{
                              background: 'rgba(255,255,255,0.2)',
                              border: 'none',
                              borderRadius: '50%',
                              width: '18px',
                              height: '18px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              color: '#fff',
                              fontSize: '12px',
                              padding: 0
                            }}
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-control"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddManualTagToNew();
                      }
                    }}
                    placeholder="Type tech stack and press Enter"
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddManualTagToNew}
                    style={{ padding: '0 20px' }}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Code Link</label>
                <input
                  type="text"
                  className="form-control"
                  value={newProject.codeLink}
                  onChange={(e) => setNewProject({ ...newProject, codeLink: e.target.value })}
                  placeholder="GitHub repository URL"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Demo Link</label>
                <input
                  type="text"
                  className="form-control"
                  value={newProject.demoLink}
                  onChange={(e) => setNewProject({ ...newProject, demoLink: e.target.value })}
                  placeholder="Live demo URL"
                />
              </div>
              <button className="btn btn-primary" onClick={handleAddProject}>
                <i className="bi bi-plus-circle me-2"></i>Add Project
              </button>
            </div>
          </div>

          {projects.map((proj) => (
            <div key={proj._id} className="card mb-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="card-header d-flex justify-content-between align-items-center" style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
                <h5 className="mb-0">{proj.title || 'Untitled'}</h5>
                {editingProject !== proj._id && (
                  <button className="btn btn-sm btn-outline-primary" onClick={() => setEditingProject(proj._id)}>
                    <i className="bi bi-pencil me-1"></i>Edit
                  </button>
                )}
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Title <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={proj.title}
                    onChange={(e) =>
                      setProjects(projects.map((p) => (p._id === proj._id ? { ...p, title: e.target.value } : p)))
                    }
                    disabled={editingProject !== proj._id}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description <span className="text-danger">*</span></label>
                  <textarea
                    rows="2"
                    className="form-control"
                    value={proj.description}
                    onChange={(e) =>
                      setProjects(projects.map((p) => (p._id === proj._id ? { ...p, description: e.target.value } : p)))
                    }
                    disabled={editingProject !== proj._id}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tech stack</label>
                  {editingProject === proj._id ? (
                    <>
                      {(proj.tags || []).length > 0 && (
                        <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {(proj.tags || []).map((tag, idx) => {
                            const color = tagColors[tag] || getRandomColor();
                            if (!tagColors[tag]) {
                              setTagColors(prev => ({ ...prev, [tag]: color }));
                            }
                            return (
                              <span
                                key={idx}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  background: color,
                                  color: '#fff',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedTags = (proj.tags || []).filter(t => t !== tag);
                                    setProjects(projects.map((p) => p._id === proj._id ? { ...p, tags: updatedTags } : p));
                                  }}
                                  style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#fff',
                                    fontSize: '12px',
                                    padding: 0
                                  }}
                                >
                                  ×
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          className="form-control"
                          value={editTagInput}
                          onChange={(e) => setEditTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddManualTagToEdit(proj);
                            }
                          }}
                          placeholder="Type tech stack and press Enter"
                        />
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => handleAddManualTagToEdit(proj)}
                          style={{ padding: '0 20px' }}
                        >
                          Add
                        </button>
                      </div>
                    </>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(proj.tags || []).map((tag, idx) => {
                        const color = tagColors[tag] || getRandomColor();
                        if (!tagColors[tag]) {
                          setTagColors(prev => ({ ...prev, [tag]: color }));
                        }
                        return (
                          <span
                            key={idx}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              background: color,
                              color: '#fff',
                              fontSize: '13px',
                              fontWeight: '600'
                            }}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Code link</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Code link"
                    value={proj.codeLink || ''}
                    onChange={(e) =>
                      setProjects(projects.map((p) => (p._id === proj._id ? { ...p, codeLink: e.target.value } : p)))
                    }
                    disabled={editingProject !== proj._id}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Demo link</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Demo link"
                    value={proj.demoLink || ''}
                    onChange={(e) =>
                      setProjects(projects.map((p) => (p._id === proj._id ? { ...p, demoLink: e.target.value } : p)))
                    }
                    disabled={editingProject !== proj._id}
                  />
                </div>
                {editingProject === proj._id && (
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={() => handleUpdateProject(proj)}>
                      <i className="bi bi-check-circle me-1"></i>Update
                    </button>
                    <button className="btn btn-secondary" onClick={() => setEditingProject(null)}>
                      Cancel
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteProject(proj._id)}>
                      <i className="bi bi-trash me-1"></i>Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </SectionCard>
      )}

      {activePage === 'resume' && (
        <SectionCard title="Resume">
          <div className="card" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="card-body">
              {resume ? (
                <div className="mb-4">
                  <div style={{
                    padding: '20px',
                    background: 'var(--input-bg)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    marginBottom: '20px'
                  }}>
                    <h5 style={{ margin: '0 0 10px' }}>Current Resume</h5>
                    <p style={{ margin: '0 0 5px', color: 'var(--text)' }}>
                      <strong>Filename:</strong> {resume.originalName}
                    </p>
                    <p style={{ margin: '0 0 15px', color: 'var(--muted)', fontSize: '0.9rem' }}>
                      Uploaded on: {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                    <div className="d-flex gap-2">
                      <a
                        href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${resume.path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                      >
                        <i className="bi bi-eye me-2"></i>View Resume
                      </a>
                      <button className="btn btn-danger" onClick={handleDeleteResume}>
                        <i className="bi bi-trash me-2"></i>Delete
                      </button>
                    </div>
                  </div>
                  <hr style={{ borderColor: 'var(--border)' }} />
                  <div className="mt-4">
                    <label className="form-label">Update Resume (PDF only)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf"
                      onChange={handleUploadResume}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-file-earmark-pdf" style={{ fontSize: '3rem', color: 'var(--muted)' }}></i>
                  <h5 className="mt-3">No resume uploaded</h5>
                  <p className="text-muted mb-4">Upload your resume in PDF format to make it available on your portfolio.</p>
                  <label className="btn btn-primary">
                    <i className="bi bi-upload me-2"></i>Upload Resume
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf"
                      hidden
                      onChange={handleUploadResume}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
};

export default AdminDashboard;

