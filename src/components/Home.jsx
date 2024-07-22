import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faList, faTable } from '@fortawesome/free-solid-svg-icons';
import UserCard from './UserCard';

function Home() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('list'); // 'list' or 'table'

  useEffect(() => {
    fetchUsers(page, searchTerm);
  }, [page, searchTerm]);

  const fetchUsers = async (page, searchTerm) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/user/${page}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ terms: searchTerm ? [searchTerm] : [] }),
      });
      const result = await response.json();

      console.log('Fetched data:', result); // Debugging

      if (Array.isArray(result.data)) {
        setUsers(prevUsers => {
          const existingIds = new Set(prevUsers.map(user => user.id));
          const newUsers = result.data.filter(user => !existingIds.has(user.id));
          return [...prevUsers, ...newUsers];
        });
      } else {
        console.error('Unexpected data format:', result);
      }
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    setUsers([]); // Réinitialiser la liste des utilisateurs
    setPage(1); // Réinitialiser la page à 1
    fetchUsers(1, searchTerm); // Effectuer la recherche avec le terme
  };

  const handleViewChange = (view) => {
    setView(view);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4 space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Rechercher un utilisateur"
            className="p-2 pr-10 border border-gray-300 rounded w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center bg-blue-500 p-2 rounded-r-md">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-white cursor-pointer"
              onClick={handleSearch}
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewChange('list')}
            className={`p-2 rounded ${view === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}
          >
            <FontAwesomeIcon icon={faList} className="text-xl" />
          </button>
          <button
            onClick={() => handleViewChange('table')}
            className={`p-2 rounded ${view === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}
          >
            <FontAwesomeIcon icon={faTable} className="text-xl" />
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {users.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-transparent">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Job</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {users.map((user, index) => (
              <tr key={user.id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-600'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  <img src={user.imageUrl} alt={user.firstName} className="w-12 h-12 rounded-full" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.firstName} {user.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.jobTitle}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {loading && <p>Loading...</p>}
      <button
        onClick={() => setPage(page + 1)}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Load more
      </button>
    </div>
  );
}

export default Home;
