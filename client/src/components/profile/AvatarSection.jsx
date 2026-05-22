import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Camera, Loader2, Pencil } from '../../lib/icons';
import { PRESET_AVATARS } from '../../lib/icons';
import { authAPI } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { getInitials } from '../../utils/avatar';

export default function AvatarSection({ user, onUpdated }) {
  const updateUser = useAuthStore((s) => s.updateUser);
  const fileRef = useRef(null);
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    if (file.size > 500 * 1024) {
      toast.error('Image must be under 500KB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
      setEditing(true);
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile({ name, bio, avatar });
      updateUser(data.user);
      onUpdated?.(data.user);
      toast.success('Profile saved!');
      setEditing(false);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expired. Please sign in again.');
        return;
      }
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mb-6"
    >
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <Camera size={20} className="text-indigo-400" />
        Profile Photo & Avatar
      </h2>

      <motion.div className="flex flex-col md:flex-row gap-8 items-start">
        <motion.div className="relative shrink-0">
          <motion.div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-indigo-500/40 bg-slate-800 flex items-center justify-center">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-indigo-300">{getInitials(name)}</span>
            )}
          </motion.div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-1 right-1 p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg"
            title="Upload photo"
          >
            <Camera size={16} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </motion.div>

        <motion.div className="flex-1 w-full space-y-4">
          <p className="text-sm text-slate-400">Upload a photo or pick a preset avatar below.</p>

          <motion.div>
            <label className="text-xs text-slate-500 uppercase tracking-wide">Display Name</label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setEditing(true);
              }}
              className="mt-1 w-full px-4 py-2.5 rounded-lg bg-slate-800/80 border border-slate-600 text-white focus:border-indigo-500 focus:outline-none"
            />
          </motion.div>

          <motion.div>
            <label className="text-xs text-slate-500 uppercase tracking-wide">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                setEditing(true);
              }}
              rows={3}
              placeholder="Tell others about your learning goals..."
              className="mt-1 w-full px-4 py-2.5 rounded-lg bg-slate-800/80 border border-slate-600 text-white focus:border-indigo-500 focus:outline-none resize-none"
            />
          </motion.div>

          <motion.div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Choose preset avatar</p>
            <motion.div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {PRESET_AVATARS.map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => {
                    setAvatar(url);
                    setEditing(true);
                  }}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition hover:scale-110 ${
                    avatar === url ? 'border-indigo-400 ring-2 ring-indigo-500/50' : 'border-slate-600'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover bg-slate-700" />
                </button>
              ))}
            </motion.div>
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={saveProfile}
            disabled={saving || !editing}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil size={16} />}
            {saving ? 'Saving...' : 'Save Profile'}
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
