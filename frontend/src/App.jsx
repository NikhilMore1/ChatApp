import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import {
  getFirestore, collection, query, orderBy, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc, setLogLevel, getDoc, setDoc,
} from 'firebase/firestore';

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

let firebaseApp = null;
let db = null;
let auth = null;

if (firebaseConfig) {
  try {
    firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp);
    auth = getAuth(firebaseApp);
    setLogLevel('error');
  } catch (e) {
    
  }
}

const getProfilesCollectionPath = () => `artifacts/${appId}/public/data/profiles`;
const initialProfiles = [
  { id: '1', name: 'Priya Sane', photoUrl: 'https://placehold.co/100x100/A1C4FD/ffffff?text=PS', description: 'Data Analyst passionate about city development.', address: 'Pune, MH', mapCoords: { x: 45, y: 70 }, contact: 'priya@example.com', interests: ['Tech', 'Hiking', 'Marathi'] },
  { id: '2', name: 'Sanjay Deshpande', photoUrl: 'https://placehold.co/100x100/C2E0FF/ffffff?text=SD', description: 'Financial Consultant working in Fintech.', address: 'Mumbai, MH', mapCoords: { x: 10, y: 65 }, contact: 'sanjay@example.com', interests: ['Fintech', 'Sailing', 'Cricket'] },
  { id: '3', name: 'Kavita Mishra', photoUrl: 'https://placehold.co/100x100/A7D9B1/ffffff?text=KM', description: 'Civil Engineer focused on infrastructure.', address: 'Nagpur, MH', mapCoords: { x: 80, y: 30 }, contact: 'kavita@example.com', interests: ['Infra', 'Reading', 'Architecture'] },
  { id: '4', name: 'Rohan Bhosale', photoUrl: 'https://placehold.co/100x100/FFD9A1/ffffff?text=RB', description: 'Vineyard Manager and agricultural tech expert.', address: 'Nashik, MH', mapCoords: { x: 30, y: 35 }, contact: 'rohan@example.com', interests: ['Agriculture', 'Wine', 'Sustainability'] },
  { id: '5', name: 'Eva Tawade', photoUrl: 'https://placehold.co/100x100/E0BBE4/ffffff?text=ET', description: 'Historian specializing in regional architecture.', address: 'Aurangabad, MH', mapCoords: { x: 55, y: 45 }, contact: 'eva@example.com', interests: ['History', 'Design', 'Caves'] },
];

const useFirebaseData = () => {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (!auth || !db) {
      setError("Firebase services are not initialized.");
      setIsLoading(false);
      return;
    }

    const authenticate = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
        setUserId(auth.currentUser?.uid || 'anonymous');
        setError('');
      } catch (authError) {
        
        setError("Failed to sign in. Data may not load.");
        setUserId(crypto.randomUUID());
      }
    };
    authenticate();
  }, []);

  useEffect(() => {
    if (!userId || !db) return;

    const colRef = collection(db, getProfilesCollectionPath());
    const dataQuery = query(colRef, orderBy('name', 'asc'));

    const checkAndSeedData = async () => {
      try {
        const seedDocRef = doc(colRef, 'initial_seed');
        const firstDoc = await getDoc(seedDocRef);
        
        if (!firstDoc.exists() || !firstDoc.data()?.seeded) {
          await setDoc(seedDocRef, { seeded: true, timestamp: Date.now() }); 
          
          for (const profile of initialProfiles) {
            const { id, ...dataToSave } = profile;
            await addDoc(colRef, dataToSave);
          }
        }
      } catch (e) {
        
      }
    };
    
    checkAndSeedData();

    setIsLoading(true);
    const unsubscribeSnapshot = onSnapshot(dataQuery, (snapshot) => {
      const profileData = snapshot.docs
        .filter(doc => doc.id !== 'initial_seed')
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          interests: Array.isArray(doc.data().interests) ? doc.data().interests : [],
          mapCoords: doc.data().mapCoords || { x: 50, y: 50 }
        }));
      setProfiles(profileData);
      setIsLoading(false);
    }, (snapshotError) => {
      
      setError("Error loading real-time profiles.");
      setIsLoading(false);
    });

    return () => unsubscribeSnapshot();
  }, [userId]);

  const crudOperation = useCallback(async (action, id, data) => {
    if (!userId) { setError("Authentication required."); return false; }
    setIsSaving(true);
    setError('');
    try {
      const colRef = collection(db, getProfilesCollectionPath());
      if (action === 'add') {
        await addDoc(colRef, { ...data, timestamp: Date.now() });
      } else if (action === 'update') {
        const docRef = doc(db, getProfilesCollectionPath(), id);
        await updateDoc(docRef, data);
      } else if (action === 'delete') {
        const docRef = doc(db, getProfilesCollectionPath(), id);
        await deleteDoc(docRef);
      }
      setIsSaving(false);
      return true;
    } catch (e) {
      
      setError(`Failed to ${action} profile.`);
      setIsSaving(false);
      return false;
    }
  }, [userId]);
  
  const addProfile = useCallback((data) => crudOperation('add', null, data), [crudOperation]);
  const updateProfile = useCallback((id, data) => crudOperation('update', id, data), [crudOperation]);
  const deleteProfile = useCallback((id) => crudOperation('delete', id, null), [crudOperation]);

  return { profiles, isLoading, isSaving, error, userId, addProfile, updateProfile, deleteProfile };
};

const PinIcon = ({ color = '#FFFFFF' }) => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 14 6 14s6-9.5 6-14c0-3.314-2.686-6-6-6zm0 9a3 3 0 100-6 3 3 0 000 6z"
      fill={color}
    />
  </svg>
);

const InteractiveMap = ({ selectedProfile }) => {
  const markerX = selectedProfile ? selectedProfile.mapCoords.x : 50;
  const markerY = selectedProfile ? selectedProfile.mapCoords.y : 50;

  return (
    <div className="w-full h-80 relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-100 transition-shadow duration-500">
      <svg viewBox="0 0 100 100" className="w-full h-full opacity-70">
        
        <path d="M 0 100 L 10 70 L 15 65 L 40 75 L 50 80 L 60 75 L 80 60 L 90 40 L 85 20 L 70 10 L 40 10 L 20 20 L 10 30 Z" fill="#b9e7f5" />
        <path d="M 10 65 L 15 60 L 25 55 L 35 40 L 40 45 L 50 60 L 60 55 L 75 45 L 85 30 L 80 20 L 70 15 L 45 15 L 30 25 L 20 35 L 10 40 Z" fill="#80cbc4" />
        <path d="M 0 100 L 5 75 L 10 65 L 0 70 Z" fill="#4db6ac" />
        
        <circle cx="50" cy="50" r="48" fill="none" stroke="#26c6da" strokeWidth="0.5" strokeDasharray="1, 1" />

        
        {selectedProfile && (
          <g style={{ transform: `translate(${markerX}px, ${markerY}px)` }} className="transition-transform duration-700 ease-out">
            <svg x="-10" y="-30" width="20" height="30" viewBox="0 0 24 30">
              <path
                d="M12 0C8.686 0 6 2.686 6 6c0 4.5 6 14 6 14s6-9.5 6-14c0-3.314-2.686-6-6-6zm0 9a3 3 0 100-6 3 3 0 000 6z"
                fill="#ef4444"
                className="shadow-lg"
              />
            </svg>
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1; 1.3; 1"
              keyTimes="0; 0.5; 1"
              dur="0.8s"
              repeatCount="indefinite"
              additive="sum"
            />
          </g>
        )}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {selectedProfile ? (
            <div className="bg-indigo-600/90 text-white text-sm font-semibold p-3 rounded-full shadow-2xl backdrop-blur-sm transform translate-y-24 transition duration-500 opacity-100 animate-pulse">
                📍 {selectedProfile.address}
            </div>
        ) : (
            <div className="text-gray-500 font-medium text-lg bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                Select a profile to view their location.
            </div>
        )}
      </div>
    </div>
  );
};

const ProfileCard = React.memo(({ profile, onShowMap, onShowDetails, onDelete, onEdit, isAdmin, isSelected }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-xl p-5 flex flex-col sm:flex-row items-center transition-all duration-300 cursor-pointer 
        ${isSelected ? 'ring-4 ring-indigo-500 scale-[1.02] bg-indigo-50' : 'hover:shadow-2xl hover:scale-[1.01]'}
      `}
      onClick={() => isSelected ? null : onShowMap(profile)}
    >
      <div className="flex-shrink-0 mb-3 sm:mb-0 sm:mr-4 relative">
        <img
          src={profile.photoUrl || 'https://placehold.co/100x100/CCCCCC/000000?text=P'}
          alt={profile.name}
          className={`w-16 h-16 rounded-full object-cover border-4 transition-colors ${isSelected ? 'border-indigo-600' : 'border-gray-300'}`}
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/CCCCCC/000000?text=P'; }}
        />
        {isSelected && (
            <div className="absolute top-0 right-0 p-1 bg-indigo-600 rounded-full">
                <PinIcon color="#fff" />
            </div>
        )}
      </div>
      <div className="flex-grow text-center sm:text-left min-w-0">
        <h3 className="text-xl font-extrabold text-gray-900 truncate">{profile.name}</h3>
        <p className="text-sm text-indigo-600 font-medium mb-2">{profile.address}</p>
        <p className="text-gray-600 text-sm line-clamp-2">{profile.description}</p>
      </div>
      <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col space-y-2 flex-shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); onShowDetails(profile); }}
          className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:bg-indigo-200 transition"
        >
          Details
        </button>
        {isAdmin && (
          <div className="flex space-x-2 pt-1 justify-center sm:justify-start">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(profile); }}
              className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 transition"
              aria-label="Edit Profile"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-3.102 10.174L7 16.5v-3.793l7.001-7.001 2.828 2.828L10.484 13.76z" /></svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(profile.id); }}
              className="p-1.5 rounded-full text-red-500 hover:bg-red-100 transition"
              aria-label="Delete Profile"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 100 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd" /></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

const Modal = ({ children, title, isOpen, onClose, isSaving }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform scale-100 transition-all duration-300 ease-out animate-in fade-in zoom-in-50">
        <div className="flex justify-between items-center p-5 border-b border-indigo-100">
          <h2 className="text-2xl font-extrabold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition p-2 rounded-full hover:bg-gray-100">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </button>
        </div>
        <div className="p-6">
          {children}
          {isSaving && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-b-3xl">
              <div className="flex items-center space-x-2 text-indigo-600 font-semibold">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span>{title.includes('Edit') ? 'Saving changes...' : 'Adding profile...'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileForm = ({ profile, onSubmit, onClose, isSaving }) => {
  const isEditing = !!profile;
  const initialData = profile || {
    name: '', photoUrl: '', description: '', address: '', contact: '',
    mapCoords: { x: 50, y: 50 }, interests: [],
  };

  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('mapCoords.')) {
      const coord = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        mapCoords: { ...prev.mapCoords, [coord]: Math.min(100, Math.max(0, Number(value))) }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleInterestChange = (e) => {
    setFormData(prev => ({ ...prev, interests: e.target.value.split(',').map(s => s.trim()).filter(s => s) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSaving) return;
    onSubmit(isEditing ? profile.id : null, formData);
  };

  const inputClass = "w-full p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm";
  const labelClass = "block text-sm font-semibold text-gray-700 mt-4";
  const buttonBaseClass = "px-6 py-3 rounded-xl font-bold transition duration-200 shadow-md";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <label className={labelClass}>Full Name</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} />

      <label className={labelClass}>Photo URL</label>
      <input type="url" name="photoUrl" value={formData.photoUrl} onChange={handleChange} className={inputClass} placeholder="e.g. https://placehold.co/100x100" />

      <label className={labelClass}>Brief Description</label>
      <textarea name="description" value={formData.description} onChange={handleChange} required className={inputClass} rows="2"></textarea>

      <label className={labelClass}>Primary Address</label>
      <input type="text" name="address" value={formData.address} onChange={handleChange} required className={inputClass} />

      <label className={labelClass}>Contact Info (Email/Phone)</label>
      <input type="text" name="contact" value={formData.contact} onChange={handleChange} required className={inputClass} />

      <label className={labelClass}>Interests (Comma separated)</label>
      <input type="text" name="interests" value={formData.interests.join(', ')} onChange={handleInterestChange} className={inputClass} />

      <h4 className="text-lg font-semibold text-indigo-700 pt-4">Map Coordinates (0-100)</h4>
      <p className="text-xs text-gray-500 mb-2">Adjust these to place the marker on the custom map.</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500">X Position</label>
          <input type="number" name="mapCoords.x" value={formData.mapCoords.x} onChange={handleChange} required className={inputClass} min="0" max="100" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500">Y Position</label>
          <input type="number" name="mapCoords.y" value={formData.mapCoords.y} onChange={handleChange} required className={inputClass} min="0" max="100" />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <button type="button" onClick={onClose} disabled={isSaving} className={`${buttonBaseClass} text-gray-700 border border-gray-300 hover:bg-gray-100 disabled:opacity-50`}>Cancel</button>
        <button type="submit" disabled={isSaving} className={`${buttonBaseClass} bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center`}>
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Processing...
            </>
          ) : (
            isEditing ? 'Save Changes' : 'Add Profile'
          )}
        </button>
      </div>
    </form>
  );
};

const ProfileDetails = ({ profile, onClose }) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-6 pb-4 border-b">
      <img
        src={profile.photoUrl || 'https://placehold.co/100x100/CCCCCC/000000?text=P'}
        alt={profile.name}
        className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/CCCCCC/000000?text=P'; }}
      />
      <div>
        <h3 className="text-3xl font-extrabold text-gray-900">{profile.name}</h3>
        <p className="text-md text-indigo-600 font-medium flex items-center">
            <PinIcon color="#4f46e5" />
            <span className="ml-1">{profile.address}</span>
        </p>
      </div>
    </div>

    <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-semibold text-gray-600 mb-1">Description</p>
            <p className="text-gray-800">{profile.description}</p>
        </div>

        <div>
            <p className="text-sm font-semibold text-gray-600">Contact Information</p>
            <p className="text-gray-800 font-mono text-lg">{profile.contact || 'N/A'}</p>
        </div>

        <div>
            <p className="text-sm font-semibold text-gray-600">Interests</p>
            <div className="flex flex-wrap gap-2 mt-1">
                {profile.interests && profile.interests.length > 0 ? (
                    profile.interests.map((interest, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full transition-colors hover:bg-green-200">
                        {interest}
                    </span>
                    ))
                ) : (
                    <span className="text-gray-500 italic text-sm">No interests listed.</span>
                )}
            </div>
        </div>
    </div>
    <div className="pt-4 text-right">
        <button onClick={onClose} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg">Close</button>
    </div>
  </div>
);

const App = () => {
  const {
    profiles, isLoading, isSaving, error, userId,
    addProfile, updateProfile, deleteProfile
  } = useFirebaseData();

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [editProfile, setEditProfile] = useState(null);

  const isAdmin = userId === 'admin-123';

  const filteredProfiles = useMemo(() => {
    if (!searchTerm) return profiles;
    const lowerSearch = searchTerm.toLowerCase();

    return profiles.filter(profile => {
        const matchesName = profile.name?.toLowerCase().includes(lowerSearch);
        const matchesAddress = profile.address?.toLowerCase().includes(lowerSearch);
        const matchesDescription = profile.description?.toLowerCase().includes(lowerSearch);
        
        const matchesInterest = profile.interests?.some(interest => interest.toLowerCase().includes(lowerSearch));
        
        return matchesName || matchesAddress || matchesDescription || matchesInterest;
    });
  }, [profiles, searchTerm]);

  const handleShowMap = useCallback((profile) => {
    setSelectedProfile(profile);
    const mapContainer = document.getElementById('map-container');
    if (mapContainer) {
        mapContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleShowDetails = useCallback((profile) => {
    setModalContent(<ProfileDetails profile={profile} onClose={() => setIsModalOpen(false)} />);
    setIsModalOpen(true);
  }, []);

  const handleOpenAddModal = useCallback(() => {
    setEditProfile(null);
    setModalContent(<ProfileForm onSubmit={handleFormSubmit} onClose={() => setIsModalOpen(false)} isSaving={isSaving} />);
    setIsModalOpen(true);
  }, [isSaving]);

  const handleOpenEditModal = useCallback((profile) => {
    setEditProfile(profile);
    setModalContent(<ProfileForm profile={profile} onSubmit={handleFormSubmit} onClose={() => setIsModalOpen(false)} isSaving={isSaving} />);
    setIsModalOpen(true);
  }, [isSaving]);

  const handleFormSubmit = async (id, formData) => {
    let success = false;
    
    if (formData.mapCoords.x < 0 || formData.mapCoords.x > 100 || formData.mapCoords.y < 0 || formData.mapCoords.y > 100) {
      
      return;
    }

    if (id) {
      success = await updateProfile(id, formData);
    } else {
      success = await addProfile(formData);
    }

    if (success) {
      setIsModalOpen(false);
      setModalContent(null);
    }
  };

  const handleDeleteProfile = useCallback(async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this profile?")) { 
        const success = await deleteProfile(id);
        if (success && selectedProfile && selectedProfile.id === id) {
            setSelectedProfile(null);
        }
    }
  }, [deleteProfile, selectedProfile]);


  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-['Inter']">
      <div className="max-w-7xl mx-auto">
        
        <header className="py-6 border-b-4 border-indigo-600/10 mb-8 flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Maharashtra Location Dashboard
          </h1>
          <div className="flex items-center space-x-3">
            {isAdmin && (
              <button
                onClick={handleOpenAddModal}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-bold shadow-xl hover:bg-indigo-700 transition duration-150 flex items-center text-sm transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                Add New Profile
              </button>
            )}
            <div className="text-sm text-gray-500 border border-gray-300 p-2 rounded-lg bg-white shadow-sm hidden md:block">
                User ID: <span className="font-mono text-xs text-indigo-500">{userId || 'N/A'}</span>
            </div>
          </div>
        </header>

        
        {(error || isSaving) && (
          <div className={`p-4 mb-6 text-sm rounded-xl shadow-lg border ${error ? 'text-red-700 bg-red-100 border-red-300' : 'text-indigo-700 bg-indigo-100 border-indigo-300'}`} role="alert">
            {error ? (
                <span className="font-bold">Error:</span>
            ) : isSaving ? (
                <span className="font-bold">Saving changes...</span>
            ) : null}
            {error}
          </div>
        )}

        
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          
          <div className="lg:col-span-2 mb-8 lg:mb-0 order-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Maharashtra Location Map</h2>
            <div id="map-container">
              <InteractiveMap selectedProfile={selectedProfile} />
            </div>
            {selectedProfile && (
                <div className="mt-4 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-xl shadow-md transition duration-300">
                    <p className="text-lg text-indigo-800 font-bold">Selected Profile: {selectedProfile.name}</p>
                    <p className="text-sm text-indigo-600">Address: {selectedProfile.address}</p>
                </div>
            )}
          </div>

          
          <div className="lg:col-span-1 order-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Directory</h2>
            
            <div className="mb-6 relative">
              <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
              <input
                type="text"
                placeholder="Search name, location, or skills..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedProfile(null);
                }}
                className="w-full p-3 pl-10 border-2 border-gray-300 rounded-xl focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition shadow-lg"
              />
            </div>

            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-lg">
                <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p className="mt-4 text-indigo-600 font-medium">Fetching profile data...</p>
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="text-center p-12 bg-white rounded-2xl shadow-lg text-gray-500">
                <p>No profiles found matching "{searchTerm}".</p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredProfiles.map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    onShowMap={handleShowMap}
                    onShowDetails={handleShowDetails}
                    onDelete={handleDeleteProfile}
                    onEdit={handleOpenEditModal}
                    isAdmin={isAdmin}
                    isSelected={selectedProfile && selectedProfile.id === profile.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      
      <Modal title={editProfile ? 'Edit Profile' : 'Add New Profile'} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isSaving={isSaving}>
        {modalContent}
      </Modal>

    </div>
  );
};

export default App;

