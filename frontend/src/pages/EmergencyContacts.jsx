// EmergencyContacts.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Trash2 } from 'lucide-react';

const EmergencyContacts = () => {
    const [contacts, setContacts] = useState(['']);
    const token = localStorage.getItem('token');

    const fetchContacts = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setContacts(res.data.emergencyContacts || ['']);
            console.log(res.data.emergencyContacts);
        } catch (err) {
            toast.error('Failed to load emergency contacts.');
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleChange = (index, value) => {
        const updated = [...contacts];
        updated[index] = value;
        setContacts(updated);
    };

    const addField = () => setContacts([...contacts, '']);

    const removeField = (index) => {
        const updated = contacts.filter((_, i) => i !== index);
        setContacts(updated.length ? updated : ['']);
    };

    const saveContacts = async () => {
        try {
            await axios.put(
                `${import.meta.env.VITE_BASE_URL}/rides/emergency-contacts`,
                { emergencyContacts: contacts },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success('Contacts saved successfully!');
        } catch (err) {
            toast.error('Failed to save contacts.');
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-white rounded ">
            <h2 className="text-lg font-bold mb-4">Emergency Contacts</h2>
            {contacts.map((contact, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={contact}
                        onChange={(e) => handleChange(idx, e.target.value)}
                        placeholder="Phone number"
                        className="border p-2 rounded w-full"
                    />
                
                    <button  onClick={() => removeField(idx)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            ))}
            <button onClick={addField} className="bg-blue-500 text-white px-3 py-1 rounded mb-2">
                Add Contact
            </button>
            <br />
            <button onClick={saveContacts} className="bg-green-500 text-white px-4 py-2 rounded">
                Save Contacts
            </button>
        </div>
    );
};

export default EmergencyContacts;
