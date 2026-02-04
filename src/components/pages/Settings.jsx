import { Building2, Mail, Phone, MapPin, Save, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    companyName: '',
    industry: 'Technology',
    employeeCount: '',
    location: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setSettings(prev => ({
        ...prev,
        companyName: userData.companyName || '',
        email: userData.email || ''
      }));
    }
  }, []);

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    localStorage.setItem('companySettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Organization Settings</h1>
            <p className="text-gray-300">Manage your company profile and preferences</p>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Building2 className="w-4 h-4 inline mr-2" />
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={settings.companyName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Your Company Ltd."
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Industry Sector
            </label>
            <select
              name="industry"
              value={settings.industry}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="Technology">Technology</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Energy">Energy</option>
              <option value="Retail">Retail</option>
              <option value="Construction">Construction</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="contact@company.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          {/* Employee Count */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Number of Employees
            </label>
            <input
              type="number"
              name="employeeCount"
              value={settings.employeeCount}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="100"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={settings.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="City, Country"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-blue-600 transition-all shadow-lg flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Settings
          </button>
        </div>
      </div>

      {/* ESG Framework Settings */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">ESG Framework Preferences</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Primary ESG Framework
            </label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent">
              <option>GRI (Global Reporting Initiative)</option>
              <option>SASB (Sustainability Accounting Standards Board)</option>
              <option>TCFD (Task Force on Climate-related Financial Disclosures)</option>
              <option>UN SDGs (Sustainable Development Goals)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Assessment Cycle
            </label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent">
              <option>Quarterly</option>
              <option>Semi-Annual</option>
              <option>Annual</option>
            </select>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Account Information</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
          <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
          <p><strong>Company:</strong> {user?.companyName || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}